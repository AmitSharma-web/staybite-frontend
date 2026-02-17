import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const AdminEditRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        city: "",
        location: "",
        type: "",
        images: "",
        description: "",
    });

    useEffect(() => {
        fetchRoom();
    }, [id]);

    const fetchRoom = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
            const data = response.data;
            setFormData({
                name: data.name,
                price: data.price,
                city: data.city || "",
                location: data.location || "",
                type: data.type,
                images: data.images ? data.images.join(", ") : data.image,
                description: data.description || "",
            });
            setLoading(false);
        } catch (error) {
            toast.error("Error fetching Room details");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                images: formData.images.split(",").map((url) => url.trim()),
            };

            await axios.put(`http://localhost:5000/api/rooms/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Room Updated Successfully");
            navigate("/admin?tab=room");
        } catch (error) {
            toast.error("Error updating Room");
        }
    };

    if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: "100px", paddingBottom: "50px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "600px", width: "95%", background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <h2 style={{ marginBottom: "20px", color: "#ff385c", textAlign: "center" }}>Edit Room</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Room Name</label>
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
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Configuration</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            >
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>City</label>
                            <input
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Location</label>
                            <input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#333" }}>Image URLs (comma separated)</label>
                        <input
                            value={formData.images}
                            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
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
                            onClick={() => navigate("/admin?tab=room")}
                            style={{ flex: 1, padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ flex: 1, padding: "12px", background: "#ff385c", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                        >
                            Update Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditRoom;
