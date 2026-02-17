import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { MapPin, ArrowLeft, Utensils, Phone, ShoppingBag, IndianRupee } from "lucide-react";

const FoodDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/food/${id}`);
                setFood(response.data);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching Food details");
                setLoading(false);
                navigate("/food");
            }
        };
        fetchFood();
    }, [id, navigate]);

    const handleOrderNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to order food");
            navigate("/signin");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/bookings", {
                food: food._id,
                bookingType: "FOOD",
                amount: food.price,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 201) {
                toast.success("Food ordered successfully! 🍔");
            } else {
                toast.error("Order failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
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
                        onClick={() => navigate("/food")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }}
                    >
                        <ArrowLeft size={20} /> Back to Menu
                    </button>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <span style={{
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
                </div>

                {/* Content Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "0", minHeight: "600px" }}>

                    {/* Left Column: Image & Description */}
                    <div style={{ padding: "30px", borderRight: "1px solid #eee" }}>
                        {/* Hero Image */}
                        <div style={{ height: "450px", borderRadius: "16px", overflow: "hidden", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                            <img
                                src={food.image}
                                alt={food.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <h3 style={{ fontSize: "1.2rem", color: "#1f2937", marginBottom: "15px" }}>About this Item</h3>
                            <p style={{ lineHeight: "1.8", color: "#4b5563", fontSize: "1rem" }}>
                                {food.description || "A delicious meal prepared with fresh ingredients. Perfect for satisfying your hunger."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div style={{ padding: "40px 30px", background: "#fafafa", display: "flex", flexDirection: "column" }}>

                        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#111827", margin: "0 0 10px 0", lineHeight: "1.2" }}>{food.name}</h1>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "30px" }}>
                            <Utensils size={18} />
                            <span>{food.restaurantName || "StayBite Kitchen"}</span>
                        </div>

                        <div style={{ padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>Price</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                <IndianRupee size={32} color="#ff385c" />
                                <span style={{ fontSize: "3rem", fontWeight: "800", color: "#ff385c" }}>{food.price}</span>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "1.1rem", color: "#1f2937", marginBottom: "15px" }}>Restaurant Details</h3>
                            <div style={{ display: "grid", gap: "15px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                    <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><Utensils size={16} /> Restaurant</span>
                                    <span style={{ fontWeight: "600", color: "#374151" }}>{food.restaurantName || "N/A"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                    <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><MapPin size={16} /> Location</span>
                                    <span style={{ fontWeight: "600", color: "#374151" }}>{food.location || "N/A"}</span>
                                </div>
                                {food.phone && (
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                        <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><Phone size={16} /> Phone</span>
                                        <span style={{ fontWeight: "600", color: "#374151" }}>{food.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                            {food.phone && (
                                <a
                                    href={`tel:${food.phone}`}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "16px",
                                        background: "white",
                                        color: "#111827",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    <Phone size={20} /> Call Now
                                </a>
                            )}
                            <button
                                onClick={handleOrderNow}
                                style={{
                                    flex: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "16px",
                                    background: "#111827",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    transition: "all 0.2s"
                                }}
                            >
                                <ShoppingBag size={20} /> Order Now
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;
