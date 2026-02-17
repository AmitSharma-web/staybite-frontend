import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "../component/ImageCarousel";
import { Star, MapPin } from "lucide-react";

const Pg = () => {
  const [pgData, setPgData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pgs");
        const data = await response.json();
        setPgData(data);
      } catch (error) {
        console.error("Error fetching PGs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
  }, []);

  if (loading)
    return (
      <div className="details-loading">
        <div className="loading-spinner" />
        <h2>Loading Best PGs for you...</h2>
      </div>
    );

  return (
    <div className="list-page">
      <div className="list-container">
        {/* Header */}
        <div className="list-header">
          <h1>
            Find Your Perfect <span className="gradient-text">Space</span>
          </h1>
          <p>Discover trusted PGs with the best amenities in your city.</p>
        </div>

        {/* Grid */}
        <div className="premium-card-grid">
          {pgData.map((pg, index) => (
            <div
              className="premium-card animate-fadeInUp"
              key={pg._id}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="premium-card-image">
                <ImageCarousel images={pg.images} height="220px" />
                <span
                  className="card-badge"
                  style={{
                    background:
                      pg.type === "Boys"
                        ? "#3b82f6"
                        : pg.type === "Girls"
                          ? "#ec4899"
                          : "#8b5cf6",
                  }}
                >
                  {pg.type}
                </span>
              </div>

              <div className="premium-card-body">
                <div className="card-title-row">
                  <h3>{pg.name}</h3>
                  <div className="card-rating">
                    <Star size={14} fill="#ff9a3c" stroke="#ff9a3c" />
                    <span>{pg.rating}</span>
                  </div>
                </div>

                <p className="card-location">
                  <MapPin size={14} />
                  {pg.city}
                </p>

                <div className="card-features-row">
                  {pg.features?.slice(0, 3).map((f, i) => (
                    <span key={i} className="feature-chip">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="card-price">
                    <span className="price-amount">{pg.rent}</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <Link to={`/pg/${pg._id}`} className="view-details-btn">
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

export default Pg;
