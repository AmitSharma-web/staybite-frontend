import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../utils/api";
import { MapPin, ArrowLeft, Edit2, Trash2, BedDouble, IndianRupee } from "lucide-react";

const AdminViewRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/rooms/${id}`);
                setRoom(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(response.data.images[0]);
                } else {
                    setSelectedImage(response.data.image);
                }
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching Room details");
                setLoading(false);
                navigate("/admin?tab=room");
            }
        };
        fetchRoom();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this Room?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${API_BASE_URL}/api/rooms/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Room Deleted Successfully");
                navigate("/admin?tab=room");
            } catch (error) {
                toast.error("Error deleting Room");
            }
        }
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
            <div className="loader"></div>
        </div>
    );

    if (!room) return null;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: "100px", paddingBottom: "50px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "1000px", width: "95%", background: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>

                {/* Header Actions */}
                <div style={{ padding: "20px 30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
                    <button
                        onClick={() => navigate("/admin?tab=room")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }}
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Link to={`/admin/room/edit/${id}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#eef2ff", color: "#4f46e5", borderRadius: "12px", textDecoration: "none", fontWeight: "600", transition: "all 0.2s" }}>
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
                        {/* Gallery */}
                        <div style={{ marginBottom: "30px" }}>
                            <div style={{ height: "400px", borderRadius: "16px", overflow: "hidden", marginBottom: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                <img
                                    src={selectedImage}
                                    alt={room.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
                                />
                            </div>
                            {room.images && room.images.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                                    {room.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            style={{
                                                height: "80px",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                border: selectedImage === img ? "2px solid #4f46e5" : "2px solid white",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <img src={img} alt={`Gallery ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 style={{ fontSize: "1.2rem", color: "#1f2937", marginBottom: "15px" }}>About this Room</h3>
                            <p style={{ lineHeight: "1.8", color: "#4b5563", fontSize: "1rem" }}>
                                {room.description || "No description provided. This is a great room with standard amenities."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details & Stats */}
                    <div style={{ padding: "40px 30px", background: "#fafafa" }}>
                        <span style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background: "#dbeafe",
                            color: "#1e40af",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            marginBottom: "15px"
                        }}>
                            {room.type} Room
                        </span>

                        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#111827", margin: "0 0 10px 0", lineHeight: "1.2" }}>{room.name}</h1>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "30px" }}>
                            <MapPin size={18} />
                            <span>{room.city ? `${room.city}` : "City not specified"} {room.location ? `• ${room.location}` : ""}</span>
                        </div>

                        <div style={{ padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>Price Per Night</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                <IndianRupee size={24} color="#ff385c" />
                                <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "#ff385c" }}>{room.price}</span>
                                <span style={{ color: "#6b7280", fontWeight: "500" }}>/ night</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", color: "#1f2937", marginBottom: "15px" }}>Room Details</h3>
                        <div style={{ display: "grid", gap: "15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><BedDouble size={16} /> Configuration</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{room.type}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><MapPin size={16} /> City</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{room.city || "N/A"}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><MapPin size={16} /> Location</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{room.location || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminViewRoom;
