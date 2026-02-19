import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  const getActiveTab = () => new URLSearchParams(location.search).get("tab");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* LOGO */}
          <Link to="/" className="logo">
            <span className="logo-stay">stay</span>
            <span className="logo-bite">Bite</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          {user ? (
            user.role === "ADMIN" ? (
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
                  <Link to="/my-bookings" className="btn-my-bookings">My Bookings</Link>
                  <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            )
          ) : (
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

          {/* MOBILE HAMBURGER BUTTON */}
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`mobile-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-content">
          {/* User info / admin badge at top of drawer */}
          {user && (
            <div className="mobile-drawer-header">
              {user.role === "ADMIN" ? (
                <div className="mobile-admin-info">
                  <div className="admin-badge">Admin</div>
                  <span className="mobile-user-name">{user?.fullName}</span>
                </div>
              ) : (
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    <User size={20} />
                  </div>
                  <span className="mobile-user-name">{user?.fullName}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation links */}
          <nav className="mobile-nav-links">
            {user?.role === "ADMIN" ? (
              // Admin navigation
              <>
                {["bookings", "pg", "room", "food", "contacts"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { navigate(`/admin?tab=${tab}`); setMenuOpen(false); }}
                    className={`mobile-nav-link ${getActiveTab() === tab ? "active" : ""}`}
                  >
                    {tab === "bookings"
                      ? "Manage Bookings"
                      : tab === "contacts"
                        ? "Messages"
                        : `Add ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                  </button>
                ))}
              </>
            ) : (
              // User / Guest navigation
              <>
                <NavLink to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink to="/Pg" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>PG</NavLink>
                <NavLink to="/Rooms" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Rooms</NavLink>
                <NavLink to="/Food" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Food</NavLink>
                <NavLink to="/Aboutus" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About Us</NavLink>
                <NavLink to="/Contactus" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
                {user && (
                  <NavLink to="/my-bookings" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
                )}
              </>
            )}
          </nav>

          {/* Bottom actions */}
          <div className="mobile-drawer-footer">
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-logout-btn">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/signin" className="mobile-btn-signin" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="mobile-btn-signup" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-spacer"></div>
    </>
  );
};

export default Header;

