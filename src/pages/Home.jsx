import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, Building2, BedDouble, Sparkles } from "lucide-react";
import ImageCarousel from "../component/ImageCarousel";
import API_BASE_URL from "../utils/api";

const Home = () => {
  const [pgs, setPgs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll-reveal refs
  const heroRef = useRef(null);
  const pgSectionRef = useRef(null);
  const roomSectionRef = useRef(null);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pgRes, roomRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/pgs`),
          fetch(`${API_BASE_URL}/api/rooms`),
        ]);
        const pgData = await pgRes.json();
        const roomData = await roomRes.json();
        setPgs(pgData);
        setRooms(roomData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15 }
    );

    [pgSectionRef, roomSectionRef, statsSectionRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="home-premium">
      {/* ============ HERO SECTION ============ */}
      <section className="premium-hero" ref={heroRef}>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>

        <div className="hero-gradient-orb orb-1" />
        <div className="hero-gradient-orb orb-2" />
        <div className="hero-gradient-orb orb-3" />

        <div className="premium-hero-content">
          <div className="hero-badge animate-fadeInDown">
            <Sparkles size={14} />
            <span>Premium Living Experience</span>
          </div>

          <h1 className="premium-hero-title animate-fadeInUp">
            Your Home, Your Meal,
            <br />
            <span className="gradient-text">One Platform</span>
          </h1>

          <p className="premium-hero-subtitle animate-fadeInUp delay-1">
            Discover handpicked PG accommodations & gourmet tiffin services
            crafted for the modern lifestyle.
          </p>

          <div className="hero-cta-group animate-fadeInUp delay-2">
            <Link to="/Pg" className="cta-primary">
              <Building2 size={18} />
              Explore PGs
              <ArrowRight size={16} />
            </Link>
            <Link to="/Rooms" className="cta-secondary">
              <BedDouble size={18} />
              Browse Rooms
            </Link>
          </div>

          <div className="hero-stats-row animate-fadeInUp delay-3">
            <div className="hero-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Residents</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Premium PGs</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ POPULAR PGs SECTION ============ */}
      <section className="premium-section reveal-section" ref={pgSectionRef}>
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Popular PGs <span className="gradient-text">Near You</span>
            </h2>
            <p className="section-subtitle">
              Handpicked accommodations with verified reviews and premium amenities
            </p>
          </div>
          <Link to="/Pg" className="see-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="premium-card-grid">
          {pgs.slice(0, 8).map((pg, index) => (
            <div
              className="premium-card"
              key={pg._id}
              style={{ animationDelay: `${index * 0.1}s` }}
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
                    <span key={i} className="feature-chip">{f}</span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="card-price">
                    <span className="price-amount">{pg.rent}</span>
                    <span className="price-period">/month</span>
                  </div>
                  <Link to={`/pg/${pg._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED ROOMS SECTION ============ */}
      <section className="premium-section reveal-section" ref={roomSectionRef}>
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Featured <span className="gradient-text">Rooms</span>
            </h2>
            <p className="section-subtitle">
              From budget-friendly bunks to executive suites — find your perfect room
            </p>
          </div>
          <Link to="/Rooms" className="see-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="premium-card-grid">
          {rooms.slice(0, 8).map((room, index) => (
            <div
              className="premium-card"
              key={room._id}
              style={{ animationDelay: `${index * 0.1}s` }}
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

                <p className="card-location">
                  <MapPin size={14} />
                  {room.city}
                </p>

                <div className="card-features-row">
                  {room.features?.slice(0, 3).map((f, i) => (
                    <span key={i} className="feature-chip">{f}</span>
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
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="premium-section why-us-section reveal-section" ref={statsSectionRef}>
        <h2 className="section-title" style={{ textAlign: "center" }}>
          Why Choose <span className="gradient-text">StayBite</span>?
        </h2>
        <p className="section-subtitle" style={{ textAlign: "center" }}>
          We go above and beyond to ensure your stay is nothing short of exceptional
        </p>

        <div className="why-us-grid">
          {[
            { icon: "🛡️", title: "Verified Properties", desc: "Every PG & room is personally verified for quality, safety, and hygiene." },
            { icon: "💰", title: "Best Price Guarantee", desc: "We match or beat any comparable listing — your wallet will thank you." },
            { icon: "🍽️", title: "Gourmet Meals", desc: "Chef-curated tiffin services delivered fresh to your doorstep daily." },
            { icon: "🔧", title: "24/7 Support", desc: "Our dedicated team is always just a call away for any issue." },
          ].map((item, i) => (
            <div className="why-us-card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="why-us-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
