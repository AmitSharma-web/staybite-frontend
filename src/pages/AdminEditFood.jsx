import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../utils/api";

const AdminEditFood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        type: "Veg",
        category: "Lunch",
        restaurantName: "",
        phone: "",
        location: "",
        image: "",
        description: "",
    });

    useEffect(() => {
        fetchFood();
    }, [id]);

    const fetchFood = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/food/${id}`);
            const data = response.data;
            setFormData({
                name: data.name,
                price: data.price,
                type: data.type,
                category: data.category || "Lunch",
                restaurantName: data.restaurantName || "",
                phone: data.phone || "",
                location: data.location || "",
                image: data.image,
                description: data.description || "",
            });
            setLoading(false);
        } catch (error) {
            toast.error("Error fetching Food details");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/api/food/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Food Updated Successfully");
            navigate("/admin?tab=food");
        } catch (error) {
            toast.error("Error updating Food");
        }
    };

    if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: "100px", paddingBottom: "50px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "600px", width: "95%", background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <h2 style={{ marginBottom: "20px", color: "#ff385c", textAlign: "center" }}>Edit Food Item</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Item Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Price</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            >
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Beverages">Beverages</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Restaurant Name</label>
                            <input
                                value={formData.restaurantName}
                                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Phone</label>
                            <input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Location</label>
                        <input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Image URL</label>
                        <input
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/admin?tab=food")}
                            style={{ flex: 1, padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ flex: 1, padding: "12px", background: "#ff385c", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                        >
                            Update Food
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditFood;
