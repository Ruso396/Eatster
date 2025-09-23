import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { FaExchangeAlt } from "react-icons/fa";
import bg from "./bg.jpg";

const carouselTexts = [
    "Increase Your Online Orders",
    "Partner with Eatster today",
    "Start Accepting Orders Online",
];

const PartnerUi = () => {
    const [currentText, setCurrentText] = useState(0);
    const [isMobileMode, setIsMobileMode] = useState(true);
    const [mobileNumber, setMobileNumber] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % carouselTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleContinue = () => {
        if (isMobileMode) {
            // Remove non-digit characters for validation and sending
            const cleanedMobileNumber = mobileNumber.replace(/\D/g, '');
            if (!/^\d{10,15}$/.test(cleanedMobileNumber)) {
                setError("Please enter a valid mobile number (10-15 digits).");
                return;
            }
            setError('');
            // Pass the cleaned mobile number as state during navigation
            navigate("/restaurantregister", { state: { mobile: cleanedMobileNumber } });
        } else {
            if (!restaurantId || restaurantId.length < 3) {
                setError("Please enter a valid Restaurant ID.");
                return;
            }
            setError('');
            // If using restaurant ID, you might navigate differently or send ID
            navigate("/restaurantregister", { state: { restaurantId: restaurantId } }); // Example for restaurantId
        }
    };

    const toggleMode = () => {
        setIsMobileMode(!isMobileMode);
        setError('');
        setMobileNumber(''); // Clear mobile number when switching mode
        setRestaurantId(''); // Clear restaurant ID when switching mode
    };

    const handleTermsAndConditionsClick = () => {
        alert("Navigating to Terms & Conditions (or showing a modal)...");
    };

    const handleApplyHereClick = (type) => {
        alert(`Navigating to Apply for ${type} (or opening an external link)...`);
    };

    return (
        <div className="font-['Segoe UI']">
            {/* Hero Section */}
            <div
                className="h-[90vh] sm:h-[70vh] xs:h-[60vh] bg-cover bg-center flex items-center justify-center relative text-white"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="bg-black bg-opacity-50 w-[90%] max-w-[1300px] flex justify-between items-center p-5 md:p-10 rounded-lg flex-col lg:flex-row gap-4 sm:gap-6 xs:gap-4">
                    {/* Left Text */}
                    <div className="lg:w-1/2 mb-4 lg:mb-0 text-center lg:text-left">
                        <h4 className="text-[#fdbb2d] text-[16px] sm:text-[18px] font-bold tracking-wider mb-2 uppercase">
                            PARTNER WITH Eatster!
                        </h4>
                        <h1 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold animate-fade-in leading-snug">
                            {carouselTexts[currentText]}
                        </h1>
                    </div>

                    {/* Right Form */}
                    <div className="lg:w-[45%] w-full">
                        <div className="bg-white text-black p-4 sm:p-6 rounded-xl shadow-lg text-sm sm:text-base">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg sm:text-xl font-semibold">Get Started</h2>
                                <button
                                    onClick={toggleMode}
                                    title="Switch Input Type"
                                    className="flex items-center gap-1 text-sm font-bold"
                                    style={{
                                        color: "rgb(255, 115, 0)",
                                        transition: "color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#e25c00";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "rgb(255, 115, 0)";
                                    }}
                                >
                                    <FaExchangeAlt className="text-lg font-bold" />
                                    <span>
                                        {isMobileMode ? "Use Restaurant ID" : "Use Mobile Number"}
                                    </span>
                                </button>
                            </div>

                            <p className="text-sm mb-3">
                                Enter a mobile number or restaurant ID to continue
                            </p>

                            <div className="mb-4">
                                {isMobileMode ? (
                                    <PhoneInput
                                        country={"in"}
                                        value={mobileNumber}
                                        onChange={(phone) => setMobileNumber(phone)}
                                        inputStyle={{
                                            width: "100%",
                                            height: "44px",
                                            fontSize: "14px",
                                            paddingLeft: "48px",
                                            borderRadius: "6px",
                                            border: error ? "2px solid red" : "1px solid #ccc",
                                        }}
                                        buttonStyle={{
                                            border: "none",
                                            backgroundColor: "transparent",
                                            paddingLeft: "12px",
                                            paddingRight: "12px",
                                        }}
                                        containerStyle={{
                                            width: "100%",
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter Restaurant ID"
                                        value={restaurantId}
                                        onChange={(e) => setRestaurantId(e.target.value)}
                                        className={`w-full h-[44px] p-2 rounded-md text-[14px] border ${
                                            error ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                            <button
                                onClick={handleContinue}
                                className="w-full p-2 sm:p-3 bg-[#fdbb2d] text-black font-bold rounded-md text-[14px] sm:text-[16px]"
                            >
                                Continue
                            </button>
                            <p className="text-xs mt-3 sm:mt-4">
                                By logging in, I agree to Eatster's{" "}
                                <button
                                    onClick={handleTermsAndConditionsClick}
                                    className="text-blue-600 underline"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    terms & conditions
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="bg-[#f8f8f8] p-6 sm:p-10 flex flex-col lg:flex-row justify-between gap-6 sm:gap-8">
                {/* Left Steps */}
                <div className="lg:w-[48%] text-[#333]">
                    <p className="text-sm font-bold text-[#ff6600]">In Just 3 Easy Steps</p>
                    <h3 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
                        Get Your Restaurant Delivery-Ready in 24hrs!
                    </h3>
                    <div className="space-y-3 text-sm sm:text-base">
                        <p>
                            <strong>STEP 1</strong>
                            <br />
                            Install the Eatster Owner App
                        </p>
                        <p>
                            <strong>STEP 2</strong>
                            <br />
                            Login/Register using your phone number
                        </p>
                        <p>
                            <strong>STEP 3</strong>
                            <br />
                            Enter restaurant details
                        </p>
                    </div>
                </div>

                {/* Right Checklist */}
                <div className="lg:w-[48%] bg-[#fff5e6] border-2 border-[#ff6600] rounded-lg p-5 sm:p-6 text-sm sm:text-base text-[#333]">
                    <p className="text-sm mb-4">
                        <strong>For an Easy Form Filling Process,</strong>
                        <br />
                        you can keep these documents handy.
                    </p>
                    <ul className="space-y-3">
                        <li className="border-l-4 border-[#ff6600] pl-3">
                            FSSAI License copy –{" "}
                            <button
                                onClick={() => handleApplyHereClick('FSSAI')}
                                className="text-[#ff6600] font-bold"
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Apply Here
                            </button>
                        </li>
                        <li className="border-l-4 border-[#ff6600] pl-3">Your Restaurant menu</li>
                        <li className="border-l-4 border-[#ff6600] pl-3">Bank details</li>
                        <li className="border-l-4 border-[#ff6600] pl-3">
                            GSTIN –{" "}
                            <button
                                onClick={() => handleApplyHereClick('GSTIN')}
                                className="text-[#ff6600] font-bold"
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Apply Here
                            </button>
                        </li>
                        <li className="border-l-4 border-[#ff6600] pl-3">PAN card copy</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PartnerUi;