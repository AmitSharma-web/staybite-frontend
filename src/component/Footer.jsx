import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-about">
          <h2>stayBite</h2>
          <p>
            stayBite is your go-to platform for hassle-free PG and room bookings across top cities in India. 
            We provide modern amenities, verified accommodations, and seamless online support. 
            Whether you’re looking for a cozy room, vibrant PG living, or nearby services, 
            we ensure your stay is comfortable, safe, and convenient.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/pg">PGs</a></li>
            <li><a href="/rooms">Rooms</a></li>
            <li><a href="/food">Food</a></li>
            <li><a href="/contactus">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@staybite.com</p>
          <p>Phone: +91 80910 55732</p>
          <p>Address: Himachal Pradesh Distt. Bilaspur </p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a 
              href="https://www.facebook.com/svgc.ghumarwin.73" 
              target="_blank" rel="noopener noreferrer"
            ><FaFacebookF /></a>

            <a 
              href="https://twitter.com/" 
              target="_blank" rel="noopener noreferrer"
            ><FaTwitter /></a>

            <a 
              href="https://www.instagram.com/ig_ansshu_?igsh=dDZnbmF1ZmZnOXZr" 
              target="_blank" rel="noopener noreferrer"
            ><FaInstagram /></a>

            <a 
              href="https://www.linkedin.com/" 
              target="_blank" rel="noopener noreferrer"
            ><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2026 StayBite. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
