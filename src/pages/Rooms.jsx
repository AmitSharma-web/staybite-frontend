import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "../component/ImageCarousel";
import { Star, MapPin } from "lucide-react";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching Rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading)
    return (
      <div className="details-loading">
        <div className="loading-spinner" />
        <h2>Loading Luxury Rooms...</h2>
      </div>
    );

  return (
    <div className="list-page">
      <div className="list-container">
        {/* Header */}
        <div className="list-header">
          <h1>
            Premium <span className="gradient-text">Rooms</span>
          </h1>
          <p>Comfortable stays for every budget — from bunks to suites.</p>
        </div>

        {/* Grid */}
        <div className="premium-card-grid">
          {rooms.map((room, index) => (
            <div
              className="premium-card animate-fadeInUp"
              key={room._id}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="premium-card-image">
                <ImageCarousel images={room.images} height="220px" />
                <span className="card-badge" style={{ background: "#1e293b" }}>
                  {room.type || "Standard"}
                </span>
              </div>

              <div className="premium-card-body">
                <div className="card-title-row">
                  <h3>{room.name}</h3>
                  <div className="card-rating">
                    <Star size={14} fill="#ff9a3c" stroke="#ff9a3c" />
                    <span>{room.rating}</span>
                  </div>
                </div>

                {room.city && (
                  <p className="card-location">
                    <MapPin size={14} />
                    {room.city}
                  </p>
                )}

                <div className="card-features-row">
                  {room.features?.slice(0, 3).map((f, i) => (
                    <span key={i} className="feature-chip">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="card-price">
                    <span className="price-amount">{room.price}</span>
                  </div>
                  <Link to={`/room/${room._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
