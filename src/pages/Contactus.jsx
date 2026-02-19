import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Send, Mail, Phone, MapPin, MessageSquare, User, AtSign } from "lucide-react";
import API_BASE_URL from "../utils/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Message sent! We'll get back to you soon 🎉");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact error:", error);
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-v2-page">
      {/* Hero */}
      <div className="contact-v2-hero">
        <div className="contact-hero-particles">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="contact-hero-content">
          <h1>Get in <span className="gradient-text">Touch</span></h1>
          <p>Have a question or need help? We'd love to hear from you.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-v2-container">
        <div className="contact-v2-grid">
          {/* Left — Info Cards */}
          <div className="contact-info-col">
            <div className="contact-info-card">
              <div className="contact-info-icon"><Mail size={22} /></div>
              <div>
                <h3>Email Us</h3>
                <p>support@staybite.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={22} /></div>
              <div>
                <h3>Call Us</h3>
                <p>+91 80910 55732</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={22} /></div>
              <div>
                <h3>Visit Us</h3>
                <p>Bilaspur, Himachal Pradesh, India 🇮🇳</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><MessageSquare size={22} /></div>
              <div>
                <h3>Response Time</h3>
                <p>Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="contact-form-card">
            <h2>Send us a Message</h2>
            <p className="contact-form-sub">Fill out the form below and our team will respond promptly.</p>

            <form onSubmit={handleSubmit}>
              <div className="contact-input-group">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-input-group">
                <AtSign size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-input-group">
                <MessageSquare size={16} className="input-icon" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-input-group textarea-group">
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={sending}>
                {sending ? "Sending..." : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
