import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, Heart, Star, Users, ArrowRight, Building2, UtensilsCrossed, Clock } from "lucide-react";

const AboutUs = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  return (
    <div className="about-v2-page">
      {/* ── Hero ── */}
      <section className="about-v2-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-inner">
          <div className="hero-badge animate-fadeInDown">
            <Heart size={14} />
            <span>Since 2024</span>
          </div>
          <h1 className="animate-fadeInUp">
            About <span className="gradient-text">StayBite</span>
          </h1>
          <p className="animate-fadeInUp delay-1">
            Connecting students and professionals with premium PGs, rooms,
            and gourmet meals — all under one roof.
          </p>
        </div>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className="about-v2-section reveal-section" ref={addRef}>
        <div className="about-v2-cards">
          <div className="about-value-card">
            <div className="value-icon" style={{ background: "rgba(255, 56, 92, 0.1)", color: "#ff385c" }}>
              <Heart size={28} />
            </div>
            <h3>Our Mission</h3>
            <p>
              To simplify the search for quality accommodation and food by providing
              a transparent, stress-free platform — no brokers, no surprises.
            </p>
          </div>

          <div className="about-value-card">
            <div className="value-icon" style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
              <Star size={28} />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become India's most trusted platform for student and professional
              housing, recognized for quality, safety, and exceptional service.
            </p>
          </div>

          <div className="about-value-card">
            <div className="value-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <Shield size={28} />
            </div>
            <h3>Our Promise</h3>
            <p>
              Every property is personally verified. Every meal, chef-curated.
              Every experience, backed by our 24/7 support team.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="about-stats-bar reveal-section" ref={addRef}>
        <div className="about-stat-item">
          <span className="about-stat-num">500+</span>
          <span className="about-stat-label">Happy Residents</span>
        </div>
        <div className="about-stat-item">
          <span className="about-stat-num">50+</span>
          <span className="about-stat-label">Verified Properties</span>
        </div>
        <div className="about-stat-item">
          <span className="about-stat-num">10+</span>
          <span className="about-stat-label">Cities Served</span>
        </div>
        <div className="about-stat-item">
          <span className="about-stat-num">4.8</span>
          <span className="about-stat-label">User Rating</span>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="about-v2-section reveal-section" ref={addRef}>
        <h2 className="about-section-title">
          What We <span className="gradient-text">Offer</span>
        </h2>
        <p className="about-section-sub">
          A complete ecosystem for modern living — all in one app.
        </p>

        <div className="about-offer-grid">
          <div className="about-offer-card">
            <Building2 size={32} />
            <h3>Premium PGs</h3>
            <p>Verified paying guest accommodations with modern amenities, home-cooked meals, and a safe environment.</p>
          </div>
          <div className="about-offer-card">
            <Users size={32} />
            <h3>Co-Living Spaces</h3>
            <p>Vibrant community-focused living with coworking zones, social events, and flexible leases.</p>
          </div>
          <div className="about-offer-card">
            <UtensilsCrossed size={32} />
            <h3>Gourmet Tiffin</h3>
            <p>Chef-curated daily meals delivered to your doorstep — nutritious, delicious, and affordable.</p>
          </div>
          <div className="about-offer-card">
            <Clock size={32} />
            <h3>24/7 Support</h3>
            <p>Our dedicated team is always available to help with any concern, big or small.</p>
          </div>
        </div>
      </section>

      {/* ── Team / Story ── */}
      <section className="about-v2-section about-story reveal-section" ref={addRef}>
        <div className="about-story-grid">
          <div className="about-story-image">
            <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&w=800" alt="Our Team" />
          </div>
          <div className="about-story-text">
            <h2>Our <span className="gradient-text">Story</span></h2>
            <p>
              StayBite was born from a simple idea: moving to a new city shouldn't
              be stressful. As students ourselves, we experienced the hassle of
              finding good PGs, negotiating with brokers, and eating unhealthy food.
            </p>
            <p>
              So we built StayBite — a platform that connects people with trusted
              accommodations and quality meals. Today, we serve 500+ happy residents
              across 10+ cities, and we're just getting started.
            </p>
            <Link to="/Contactus" className="about-cta">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section reveal-section" ref={addRef}>
        <h2>Ready to Find Your <span className="gradient-text">Perfect Stay</span>?</h2>
        <p>Browse our handpicked properties and start your journey today.</p>
        <div className="about-cta-buttons">
          <Link to="/Pg" className="cta-primary">Explore PGs <ArrowRight size={16} /></Link>
          <Link to="/Rooms" className="cta-secondary">Browse Rooms</Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
