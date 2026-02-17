import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { MapPin, ArrowLeft, Edit2, Trash2, Home, IndianRupee } from "lucide-react";

const AdminViewPg = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pg, setPg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const fetchPG = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/pgs/${id}`);
                setPg(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(response.data.images[0]);
                } else {
                    setSelectedImage(response.data.image);
                }
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching PG details");
                setLoading(false);
                navigate("/admin?tab=pg");
            }
        };
        fetchPG();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this PG?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/pgs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("PG Deleted Successfully");
                navigate("/admin?tab=pg");
            } catch (error) {
                toast.error("Error deleting PG");
            }
        }
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
            <div className="loader"></div>
        </div>
    );

    if (!pg) return null;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: "100px", paddingBottom: "50px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "1000px", width: "95%", background: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>

                {/* Header Actions */}
                <div style={{ padding: "20px 30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
                    <button
                        onClick={() => navigate("/admin?tab=pg")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }}
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Link to={`/admin/pg/edit/${id}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#eef2ff", color: "#4f46e5", borderRadius: "12px", textDecoration: "none", fontWeight: "600", transition: "all 0.2s" }}>
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
                                    alt={pg.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
                                />
                            </div>
                            {pg.images && pg.images.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                                    {pg.images.map((img, idx) => (
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
                            <h3 style={{ fontSize: "1.2rem", color: "#1f2937", marginBottom: "15px" }}>About this PG</h3>
                            <p style={{ lineHeight: "1.8", color: "#4b5563", fontSize: "1rem" }}>
                                {pg.description || "No description provided for this property. Add a description to help users understand what makes this PG special."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details & Stats */}
                    <div style={{ padding: "40px 30px", background: "#fafafa" }}>
                        <span style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background: pg.type === "Girls" ? "#fce7f3" : pg.type === "Boys" ? "#dbeafe" : "#e0e7ff",
                            color: pg.type === "Girls" ? "#db2777" : pg.type === "Boys" ? "#1e40af" : "#4338ca",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            marginBottom: "15px"
                        }}>
                            {pg.type} Hostel
                        </span>

                        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#111827", margin: "0 0 10px 0", lineHeight: "1.2" }}>{pg.name}</h1>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "30px" }}>
                            <MapPin size={18} />
                            <span>{pg.city} {pg.location ? `• ${pg.location}` : ""}</span>
                        </div>

                        <div style={{ padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>Monthly Rent</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                <IndianRupee size={24} color="#ff385c" />
                                <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "#ff385c" }}>{pg.rent}</span>
                                <span style={{ color: "#6b7280", fontWeight: "500" }}>/ month</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", color: "#1f2937", marginBottom: "15px" }}>Property Details</h3>
                        <div style={{ display: "grid", gap: "15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><Home size={16} /> Category</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>PG / Hostel</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><MapPin size={16} /> City</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{pg.city}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
                                <span style={{ color: "#6b7280", display: "flex", gap: "8px", alignItems: "center" }}><MapPin size={16} /> Area</span>
                                <span style={{ fontWeight: "600", color: "#374151" }}>{pg.location || "N/A"}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminViewPg;
