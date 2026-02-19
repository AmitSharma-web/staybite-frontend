import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Star, MapPin, ArrowLeft, Shield, Wifi, Wind, UtensilsCrossed, Dumbbell, Car, Eye, Calendar, Users } from "lucide-react";
import ImageCarousel from "../component/ImageCarousel";
import API_BASE_URL from "../utils/api";

const iconMap = {
  "Wi-Fi": <Wifi size={16} />,
  "AC": <Wind size={16} />,
  "Meals Included": <UtensilsCrossed size={16} />,
  "Meals": <UtensilsCrossed size={16} />,
  "Gym": <Dumbbell size={16} />,
  "Parking": <Car size={16} />,
  "24/7 Security": <Shield size={16} />,
  "CCTV": <Eye size={16} />,
};

const PgDetails = () => {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pgs/${id}`);
        if (!response.ok) throw new Error("PG not found");
        const data = await response.json();
        setPg(data);
      } catch (error) {
        console.error("Error fetching PG:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [id]);

  const handleBookNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book this PG");
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

    const amount = pg.price || parseInt(pg.rent.replace(/[^\d]/g, ""), 10);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pg: pg._id,
          bookingType: "PG",
          amount,
          checkIn,
          checkOut,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("PG booked successfully! 🎉");
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
        <h2>Loading Details...</h2>
      </div>
    );

  if (!pg)
    return (
      <div className="details-loading">
        <h2>PG Not Found</h2>
        <Link to="/Pg" style={{ color: "var(--primary)", textDecoration: "none", marginTop: "1rem" }}>← Browse all PGs</Link>
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
          <Link to="/">Home</Link> / <Link to="/Pg">PGs</Link> / <span>{pg.name}</span>
        </div>
      </div>

      {/* ── Title Row ── */}
      <div className="detail-title-section">
        <div>
          <div className="detail-tag-row">
            <span className="detail-type-tag" style={{
              background: pg.type === "Boys" ? "#3b82f6" : pg.type === "Girls" ? "#ec4899" : "#8b5cf6"
            }}>{pg.type}</span>
            <span className="detail-location-tag"><MapPin size={14} /> {pg.city}</span>
          </div>
          <h1 className="detail-name">{pg.name}</h1>
          <div className="detail-meta">
            <span className="detail-rating"><Star size={15} fill="#ff9a3c" stroke="#ff9a3c" /> {pg.rating || "4.5"}</span>
            <span className="detail-dot">·</span>
            <span>{pg.reviews?.length || 0} reviews</span>
          </div>
        </div>
      </div>

      {/* ── Image Gallery ── */}
      <div className="detail-gallery">
        <div className="detail-gallery-main">
          <img
            src={pg.images?.[selectedImg]}
            alt={pg.name}
            onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
          />
        </div>
        <div className="detail-gallery-thumbs">
          {pg.images?.map((img, i) => (
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
            <h2>About this Place</h2>
            <p className="detail-desc">
              {pg.description || "Experience comfort and convenience at its best. This PG offers a perfect blend of modern amenities and a homely atmosphere."}
            </p>
          </div>

          {/* Amenities */}
          <div className="detail-section-card">
            <h2>Amenities & Features</h2>
            <div className="detail-amenities-grid">
              {(pg.features?.length > 0
                ? pg.features
                : ["Wi-Fi", "AC", "Power Backup", "Housekeeping", "Security", "Meals"]
              ).map((item, i) => (
                <div key={i} className="detail-amenity-chip">
                  <span className="amenity-icon">{iconMap[item] || "✓"}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="detail-section-card">
            <h2>Guest Reviews</h2>
            {pg.reviews && pg.reviews.length > 0 ? (
              <div className="detail-reviews-grid">
                {pg.reviews.map((r, i) => (
                  <div key={i} className="detail-review-bubble">
                    <div className="review-avatar">{String.fromCodePoint(0x1F464)}</div>
                    <div>
                      <div className="review-stars">{"⭐".repeat(Math.min(5, Math.floor(pg.rating || 4)))}</div>
                      <p>"{r}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Right — Booking Card */}
        <div className="detail-right-col">
          <div className="detail-booking-card">
            <div className="booking-card-header">
              <div>
                <span className="booking-big-price">{pg.rent}</span>
                <span className="booking-per"> / month</span>
              </div>
              <div className="booking-mini-rating">
                <Star size={14} fill="#ff9a3c" stroke="#ff9a3c" /> {pg.rating || "4.5"}
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
                  <span><strong>₹{Math.round((pg.price || 6000) / 30 * getDays()).toLocaleString()}</strong></span>
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

export default PgDetails;
