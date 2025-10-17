import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCity,
  FaMapPin,
  FaMapMarkedAlt,
  FaIdBadge,
  FaUniversity,
  FaLock,
} from "react-icons/fa";

// Restaurant Register Form
const RestaurantRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    mobile: "",
    email: "",
    city: "",
    pincode: "",
    address: "",
    fssai: "",
    gstin: "",
    pan: "",
    account_name: "",
    account_number: "",
    ifsc: "",
    password: "",
    latitude: null, // New state for latitude
    longitude: null, // New state for longitude
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false); // New loading state for pincode lookup

  // Function to get Lat/Long from pincode
  const getCoordinatesFromPincode = async (pincode) => {
    setLoadingLocation(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`
      );
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));
        Swal.fire({
          icon: "success",
          title: "Location detected!",
          text: `Coordinates for pincode ${pincode} found.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setFormData((prev) => ({ ...prev, latitude: null, longitude: null }));
        Swal.fire({
          icon: "error",
          title: "Location not found",
          text: "Could not find coordinates for this pincode. Please try another.",
        });
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      setFormData((prev) => ({ ...prev, latitude: null, longitude: null }));
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch coordinates. Please try again.",
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      getCoordinatesFromPincode(formData.pincode);
    } else {
      setFormData((prev) => ({ ...prev, latitude: null, longitude: null }));
    }
  }, [formData.pincode]); // Trigger lookup when pincode changes

  const validateStep = () => {
    const newErrors = {};
    let requiredFields = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const mobileOnlyDigits = formData.mobile.replace(/\D/g, "");

    if (step === 1) {
      requiredFields = ["name", "owner", "mobile", "email", "city", "pincode", "address"];
      if (mobileOnlyDigits.length !== 10)
        newErrors.mobile = "Enter valid 10-digit mobile number";
      if (!emailRegex.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.latitude || !formData.longitude) {
        newErrors.pincode = "Failed to get coordinates for this pincode.";
      }
    } else if (step === 2) {
      requiredFields = [
        "fssai",
        "gstin",
        "pan",
        "account_name",
        "account_number",
        "ifsc",
      ];
      if (!/^\d{14}$/.test(formData.fssai))
        newErrors.fssai = "FSSAI must be 14 digits";
      if (formData.gstin.length !== 15)
        newErrors.gstin = "GSTIN must be 15 characters";
      if (!panRegex.test(formData.pan))
        newErrors.pan = "PAN must match format: ABCDE1234F";
      if (!/^\d{12}$/.test(formData.account_number))
        newErrors.account_number = "Account No. must be 12 digits";
      if (!ifscRegex.test(formData.ifsc))
        newErrors.ifsc = "Invalid IFSC format (e.g., ABCD0123456)";
    } else if (step === 3) {
      requiredFields = ["password"];
      if (formData.password.length < 6)
        newErrors.password = "Minimum 6 characters required";
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "Required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      const dataToSend = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        // If you were sending foodCategories data with files, you'd need to append it to FormData here
        // For now, assuming you handle it as string or not from frontend in this particular POST.
      };

      // Changed expectation to 202 Accepted as data is pending review
      const response = await axios.post(
        "https://eatster-nine.vercel.app/api/restaurants",
 
        dataToSend
      );

      if (response.status === 202) { // 202 Accepted status for pending registration
        Swal.fire({
          icon: "success",
          title: "Registration Submitted!",
          text: "Your restaurant details have been submitted for admin review. An email has been sent to the admin for verification.",
        });
        navigate("/"); // Redirect or show a message
      } else {
        // Fallback for unexpected success statuses, though 202 is intended
        Swal.fire("Success", "Registered Successfully!", "success");
        navigate("/");
      }

    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      let errorMessage = "Something went wrong during registration.";
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error; // Use backend-provided error message
      } else if (err.message) {
        errorMessage = err.message;
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const renderInput = (
    field,
    label,
    icon,
    type = "text",
    isTextArea = false,
    isReadOnly = false
  ) => (
    <div className={`w-full ${isTextArea ? "col-span-2" : "md:w-[48%]"} mb-4`}>
      <label className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      <div
        className={`flex items-center border-b border-gray-400 p-2 bg-white text-sm ${
          errors[field] ? "border-red-500" : "focus-within:border-orange-500"
        }`}
      >
        <span className="text-black mr-2">{icon}</span>
        {isTextArea ? (
          <textarea
            name={field}
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            rows={3}
            className="w-full bg-white outline-none text-black placeholder-gray-500 resize-none"
            placeholder={label}
            readOnly={isReadOnly}
          />
        ) : (
          <input
            type={type}
            name={field}
            value={formData[field]}
            maxLength={field === "mobile" ? 10 : undefined}
            onChange={(e) => {
              const value =
                field === "mobile"
                  ? e.target.value.replace(/\D/g, "")
                  : e.target.value;
              setFormData({ ...formData, [field]: value });
            }}
            className="w-full bg-white outline-none text-black placeholder-gray-500"
            placeholder={label}
            readOnly={isReadOnly}
          />
        )}
      </div>
      {errors[field] && (
        <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
      )}
      {field === "pincode" && loadingLocation && (
        <p className="text-blue-500 text-xs mt-1">Detecting location...</p>
      )}
      {field === "pincode" && formData.latitude && formData.longitude && (
        <p className="text-green-600 text-xs mt-1">
          Location detected: Lat {formData.latitude}, Lng {formData.longitude}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl rounded-xl shadow-xl bg-white text-black flex flex-col md:flex-row">
        <div className="w-full md:w-[30%] p-6 border-r border-gray-200">
          <h3 className="text-xl font-semibold mb-8">Restaurant Register</h3>
          {["Basic Info", "Legal & Bank", "Set Password"].map((label, i) => (
            <div
              key={i}
              className={`flex gap-3 items-start mb-6 ${
                step >= i + 1 ? "opacity-100" : "opacity-50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full text-center font-bold text-white ${
                  step > i + 1 ? "bg-green-600" : "bg-orange-500"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-gray-600">
                  {i === 0
                    ? "Owner & Contact"
                    : i === 1
                    ? "License & Bank"
                    : "Create Login Credentials"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-[70%] p-6 sm:p-10">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
              <div className="flex flex-wrap justify-between">
                {renderInput("name", "Restaurant Name", <FaUser />)}
                {renderInput("owner", "Owner Name", <FaUser />)}
                {renderInput("mobile", "Mobile Number", <FaPhone />, "text")}
                {renderInput("email", "Email", <FaEnvelope />, "email")}
                {renderInput("city", "City", <FaCity />)}
                {renderInput("pincode", "Pincode", <FaMapPin />)}
                {renderInput("address", "Address", <FaMapMarkedAlt />, "text", true)}
              </div>
              <button
                onClick={() => validateStep() && setStep(2)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md mt-4 font-bold"
                disabled={loadingLocation} // Disable "Next" button while fetching location
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Legal & Bank Details</h2>
              <div className="flex flex-wrap justify-between">
                {renderInput("fssai", "FSSAI Number", <FaIdBadge />)}
                {renderInput("gstin", "GSTIN", <FaIdBadge />)}
                {renderInput("pan", "PAN Number", <FaIdBadge />)}
                {renderInput("account_name", "Account Holder", <FaUniversity />)}
                {renderInput("account_number", "Account Number", <FaUniversity />)}
                {renderInput("ifsc", "IFSC Code", <FaUniversity />)}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-md font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => validateStep() && setStep(3)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-bold"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Set Your Password</h2>
              <div className="flex flex-wrap justify-between">
                {renderInput("password", "Password", <FaLock />, "password")}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-md font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister;