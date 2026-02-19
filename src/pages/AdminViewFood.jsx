import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../utils/api";
import { MapPin, ArrowLeft, Edit2, Trash2, Utensils, IndianRupee, Phone, ShoppingBag } from "lucide-react";

const AdminViewFood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/food/${id}`);
                setFood(response.data);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching Food details");
                setLoading(false);
                navigate("/admin?tab=food");
            }
        };
        fetchFood();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this Food Item?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${API_BASE_URL}/api/food/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Food Deleted Successfully");
                navigate("/admin?tab=food");
            } catch (error) {
                toast.error("Error deleting Food");
            }
        }
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
            <div className="loader"></div>
        </div>
    );

    if (!food) return null;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: "100px", paddingBottom: "50px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "1000px", width: "95%", background: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>

                {/* Header Actions */}
                <div style={{ padding: "20px 30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
                    <button
                        onClick={() => navigate("/admin?tab=food")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }}
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Link to={`/admin/food/edit/${id}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#eef2ff", color: "#4f46e5", borderRadius: "12px", textDecoration: "none", fontWeight: "600", transition: "all 0.2s" }}>
                            <Edit2 size={16} /> Edit
                        </Link>
                        <button onClick={handleDelete} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "0", minHeight: "600px" }}>

                    {/* Left Column: Images & Key Info */}
                    <div style={{ padding: "30px", borderRight: "1px solid #eee" }}>
                        {/* Hero Image */}
                        <div style={{ height: "450px", borderRadius: "16px", overflow: "hidden", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                            <img
                                src={food.image}
                                alt={food.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => e.target.src = "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&w=800"}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <h3 style={{ fontSize: "1.2rem", color: "#1f2937", marginBottom: "15px" }}>About this Item</h3>
                            <p style={{ lineHeight: "1.8", color: "#4b5563", fontSize: "1rem" }}>
                                {food.description || "No description provided for this delicious item."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details & Stats */}
                    <div style={{ padding: "40px 30px", background: "#fafafa" }}>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                            <span style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                background: food.type === "Veg" ? "#d1e7dd" : "#f8d7da",
                                color: food.type === "Veg" ? "#0f5132" : "#842029",
                                fontWeight: "600",
                                fontSize: "0.9rem"
                            }}>
                                {food.type}
                            </span>
                            <span style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                background: "#f3f4f6",
                                color: "#4b5563",
                                fontWeight: "600",
                                fontSize: "0.9rem"
                            }}>
                                {food.category}
                            </span>
                        </div>

                        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#111827", margin: "0 0 10px 0", lineHeight: "1.2" }}>{food.name}</h1>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "30px" }}>
                            <Utensils size={18} />
                            <span>{food.restaurantName || "Restaurant Not Listed"}</span>
                        </div>

                        <div style={{ padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>Price</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                <IndianRupee size={24} color="#ff385c" />
                                <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "#ff385c" }}>{food.price}</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", color: "#1f2937", marginBottom: "15px" }}>Order Details</h3>
                        <div style={{ display: "grid", gap: "15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><ShoppingBag size={16} /> Category</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{food.category}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><Utensils size={16} /> Restaurant</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{food.restaurantName || "N/A"}</span>
                            </div>
                            {food.phone && (
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                    <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><Phone size={16} /> Contact</span>
                                    <span style={{ fontWeight: "600", color: "#374151" }}>{food.phone}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><MapPin size={16} /> Location</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{food.location || "N/A"}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminViewFood;
