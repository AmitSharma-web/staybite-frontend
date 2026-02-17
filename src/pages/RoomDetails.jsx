import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Star, MapPin, ArrowLeft, Shield, Wifi, Wind, Calendar } from "lucide-react";
import ImageCarousel from "../component/ImageCarousel";

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
                if (!response.ok) throw new Error("Room not found");
                const data = await response.json();
                setRoom(data);
            } catch (error) {
                console.error("Error fetching Room:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleBookNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to book this room");
            return;
        }
        if (!checkIn || !checkOut) {
            toast.error("Please select check-in and check-out dates");
            return;
        }
        if (new Date(checkOut) <= new Date(checkIn)) {
            toast.error("Check-out must be after check-in");
            return;
        }

        const amount = room.numericPrice || parseInt(room.price.replace(/[^\d]/g, ""), 10);

        try {
            const response = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    room: room._id,
                    bookingType: "ROOM",
                    amount,
                    checkIn,
                    checkOut,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Room booked successfully! 🎉");
                setCheckIn("");
                setCheckOut("");
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong");
        }
    };

    const getDays = () => {
        if (!checkIn || !checkOut) return 0;
        return Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    };

    if (loading)
        return (
            <div className="details-loading">
                <div className="loading-spinner" />
                <h2>Loading Room Details...</h2>
            </div>
        );

    if (!room)
        return (
            <div className="details-loading">
                <h2>Room Not Found</h2>
                <Link to="/Rooms" style={{ color: "var(--primary)", textDecoration: "none", marginTop: "1rem" }}>← Browse all Rooms</Link>
            </div>
        );

    return (
        <div className="detail-page-v2">
            {/* ── Top Bar ── */}
            <div className="detail-topbar">
                <button className="detail-back" onClick={() => window.history.back()}>
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="detail-breadcrumb">
                    <Link to="/">Home</Link> / <Link to="/Rooms">Rooms</Link> / <span>{room.name}</span>
                </div>
            </div>

            {/* ── Title Row ── */}
            <div className="detail-title-section">
                <div>
                    <div className="detail-tag-row">
                        <span className="detail-type-tag" style={{ background: "#1e293b" }}>{room.type || "Standard"}</span>
                        {room.city && <span className="detail-location-tag"><MapPin size={14} /> {room.city}</span>}
                    </div>
                    <h1 className="detail-name">{room.name}</h1>
                    <div className="detail-meta">
                        <span className="detail-rating"><Star size={15} fill="#ff9a3c" stroke="#ff9a3c" /> {room.rating || "4.5"}</span>
                    </div>
                </div>
            </div>

            {/* ── Image Gallery ── */}
            <div className="detail-gallery">
                <div className="detail-gallery-main">
                    <img
                        src={room.images?.[selectedImg]}
                        alt={room.name}
                        onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
                    />
                </div>
                <div className="detail-gallery-thumbs">
                    {room.images?.map((img, i) => (
                        <div
                            key={i}
                            className={`detail-thumb ${selectedImg === i ? "active" : ""}`}
                            onClick={() => setSelectedImg(i)}
                        >
                            <img
                                src={img}
                                alt={`View ${i + 1}`}
                                onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Content Grid ── */}
            <div className="detail-content-grid">
                {/* Left */}
                <div className="detail-left-col">
                    {/* About */}
                    <div className="detail-section-card">
                        <h2>About this Room</h2>
                        <p className="detail-desc">
                            {room.description || "A comfortable and well-maintained room with modern amenities, perfect for students and professionals."}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="detail-section-card">
                        <h2>Features & Amenities</h2>
                        <div className="detail-amenities-grid">
                            {(room.features?.length > 0
                                ? room.features
                                : ["Wi-Fi", "AC", "Power Backup", "Housekeeping"]
                            ).map((item, i) => (
                                <div key={i} className="detail-amenity-chip">
                                    <span className="amenity-icon">✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Booking Card */}
                <div className="detail-right-col">
                    <div className="detail-booking-card">
                        <div className="booking-card-header">
                            <div>
                                <span className="booking-big-price">{room.price}</span>
                            </div>
                            <div className="booking-mini-rating">
                                <Star size={14} fill="#ff9a3c" stroke="#ff9a3c" /> {room.rating || "4.5"}
                            </div>
                        </div>

                        <div className="booking-date-box">
                            <div className="booking-date-field">
                                <label><Calendar size={14} /> Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>
                            <div className="booking-date-divider" />
                            <div className="booking-date-field">
                                <label><Calendar size={14} /> Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    min={checkIn || new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />
                            </div>
                        </div>

                        {getDays() > 0 && (
                            <div className="booking-calc">
                                <div className="calc-row">
                                    <span>Stay Duration</span>
                                    <span><strong>{getDays()}</strong> nights</span>
                                </div>
                                <div className="calc-row total">
                                    <span>Total (est.)</span>
                                    <span><strong>₹{Math.round((room.numericPrice || 5000) / 30 * getDays()).toLocaleString()}</strong></span>
                                </div>
                            </div>
                        )}

                        <button className="booking-reserve-btn" onClick={handleBookNow}>
                            Book Now
                        </button>

                        <p className="booking-small-note">You won't be charged yet</p>

                        <div className="booking-trust-row">
                            <Shield size={14} /> <span>Verified Property · Secure Booking</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
