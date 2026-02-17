import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  const getActiveTab = () => new URLSearchParams(location.search).get("tab");

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* LOGO */}
          <Link to="/" className="logo">
            <span className="logo-stay">stay</span>
            <span className="logo-bite">Bite</span>
          </Link>

          {/* AUTH / NAVIGATION */}
          {user ? (
            user.role === "ADMIN" ? (
              // ADMIN HEADER CONTENT
              <>
                <div className="admin-nav-group">
                  {["bookings", "pg", "room", "food", "contacts"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => navigate(`/admin?tab=${tab}`)}
                      className={`admin-nav-btn ${getActiveTab() === tab ? "active" : ""}`}
                    >
                      {tab === "bookings"
                        ? "Manage Bookings"
                        : tab === "contacts"
                          ? "Messages"
                          : `Add ${tab}`}
                    </button>
                  ))}
                </div>

                <div className="nav-actions">
                  <div className="admin-badge">Admin</div>
                  <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              // USER HEADER CONTENT
              <>
                <nav className="nav-links">
                  <NavLink to="/" className="link">Home</NavLink>
                  <NavLink to="/Pg" className="link">PG</NavLink>
                  <NavLink to="/Rooms" className="link">Rooms</NavLink>
                  <NavLink to="/Food" className="link">Food</NavLink>
                  <NavLink to="/Aboutus" className="link">About Us</NavLink>
                  <NavLink to="/Contactus" className="link">Contact</NavLink>
                </nav>

                <div className="nav-actions">
                  <div className="user-profile">
                    <User size={18} />
                    <span>{user?.fullName?.split(" ")[0]}</span>
                  </div>
                  <Link to="/my-bookings" className="btn-my-bookings">
                    My Bookings
                  </Link>
                  <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            )
          ) : (
            // GUEST HEADER CONTENT
            <>
              <nav className="nav-links">
                <NavLink to="/" className="link">Home</NavLink>
                <NavLink to="/Pg" className="link">PG</NavLink>
                <NavLink to="/Rooms" className="link">Rooms</NavLink>
                <NavLink to="/Food" className="link">Food</NavLink>
                <NavLink to="/Aboutus" className="link">About Us</NavLink>
                <NavLink to="/Contactus" className="link">Contact</NavLink>
              </nav>

              <div className="nav-auth-buttons">
                <Link to="/signin" className="btn-signin">Sign in</Link>
                <Link to="/signup" className="btn-signup">Sign up</Link>
              </div>
            </>
          )}
        </div>
      </header>
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;

