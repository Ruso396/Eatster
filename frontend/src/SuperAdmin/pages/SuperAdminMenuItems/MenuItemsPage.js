import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = "https://eatster-nine.vercel.app";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/menu`);
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not fetch menu items", "error");
    }
  };

  const handleAddOrEdit = async (item = null) => {
    const isEdit = !!item;

    const { value: formValues } = await Swal.fire({
      title: isEdit ? "Edit Menu Item" : "Add Menu Item",
      html:
        `<input id="swal-foodname" class="swal2-input" placeholder="Food Name" value="${item ? item.foodname : ""}">` +
        `<select id="swal-type" class="swal2-input">
            <option value="veg" ${item && item.type === "veg" ? "selected" : ""}>Veg</option>
            <option value="nonveg" ${item && item.type === "nonveg" ? "selected" : ""}>Non-Veg</option>
         </select>` +
        `<input id="swal-img" type="file" accept="image/*" class="swal2-file">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          foodname: document.getElementById("swal-foodname").value.trim(),
          type: document.getElementById("swal-type").value,
          img: document.getElementById("swal-img").files[0] || null,
        };
      },
    });

    if (!formValues) return;

    const { foodname, type, img } = formValues;

    if (!foodname) {
      Swal.fire("Missing!", "Food name is required", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("foodname", foodname);
    formData.append("type", type);
    if (img) formData.append("img", img);

    try {
      if (isEdit) {
        await axios.put(`${BASE_URL}/api/menu/${item.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated!", "Menu item updated", "success");
      } else {
        if (!img) {
          Swal.fire("Missing!", "Please choose an image", "warning");
          return;
        }
        await axios.post(`${BASE_URL}/api/menu`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Added!", "Menu item added", "success");
      }

      fetchMenu();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the menu item permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`${BASE_URL}/api/menu/${id}`);
      Swal.fire("Deleted!", "Menu item deleted.", "success");
      fetchMenu();
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "30px auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", fontSize: "24px" }}>
        🍽️ Menu Dashboard
      </h1>

      <button
        onClick={() => handleAddOrEdit()}
        style={{
          padding: "10px 20px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
          borderRadius: "4px",
        }}
      >
        ➕ Add New Item
      </button>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 0 10px #ddd",
          fontFamily: "sans-serif",
        }}
      >
        <thead>
          <tr style={{ background: "#f8f8f8" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Food Name</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Image Name</th>
            <th style={thStyle}>Preview</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.foodname}</td>
              <td style={tdStyle}>{item.type}</td>
              <td style={tdStyle}>{item.img}</td>
              <td style={tdStyle}>
                {item.img ? (
                 <img
  src={`${BASE_URL}/images/${item.img}`}
  alt={item.foodname}
  style={{
    borderRadius: "50%", // this makes it circular
    width: "80px",
    height: "80px",
    objectFit: "cover",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  }}
/>

                ) : (
                  "-"
                )}
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
  <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
    <FaEdit
      onClick={() => handleAddOrEdit(item)}
      style={{ color: "#007bff", cursor: "pointer" }}
    />
    <FaTrash
      onClick={() => handleDelete(item.id)}
      style={{ color: "#dc3545", cursor: "pointer" }}
    />
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};