import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, Calendar, MapPin, CreditCard, Info } from "lucide-react";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/bookings/my-bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success("Booking Cancelled Successfully");
                fetchBookings(); // Refresh list
                setSelectedBooking(null); // Close modal
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            toast.error("Something went wrong");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) return (
        <div className="details-loading">
            <div className="loading-spinner" />
            <h2>Loading Bookings...</h2>
        </div>
    );

    return (
        <div className="list-page">
            <div className="list-container">
                <div className="list-header">
                    <h1>My <span className="gradient-text">Bookings</span></h1>
                    <p>Track all your accommodation and food orders.</p>
                </div>

                {bookings?.length === 0 ? (
                    <div className="no-bookings">
                        <div style={{ background: "#f8f9fa", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <Calendar size={40} color="#ddd" />
                        </div>
                        <h3>No Bookings Yet</h3>
                        <p>You haven't made any bookings. Start exploring our premium stays!</p>
                        <a href="/" className="btn-browse">Browse Stays</a>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {bookings?.map((booking) => (
                            <div key={booking._id} className="booking-card">
                                {/* Image Section */}
                                <div className="booking-image-container">
                                    <img
                                        src={
                                            booking.bookingType === "PG"
                                                ? booking.pg?.image?.[0] || "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
                                                : booking.bookingType === "ROOM"
                                                    ? booking.room?.image?.[0] || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
                                                    : booking.food?.image || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                                        }
                                        alt="Booking"
                                        className="booking-image"
                                    />
                                    <div className={`status-badge ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="booking-content">
                                    <h3 className="booking-title">
                                        {booking.bookingType === "PG"
                                            ? booking.pg?.name
                                            : booking.bookingType === "ROOM"
                                                ? booking.room?.name
                                                : booking.food?.name}
                                    </h3>

                                    <div className="booking-info-row">
                                        <span className="info-icon"><MapPin size={14} /></span>
                                        <span>
                                            {booking.bookingType === "PG"
                                                ? booking.pg?.city
                                                : booking.bookingType === "ROOM"
                                                    ? "Luxury Stay"
                                                    : "Gourmet Food"}
                                        </span>
                                    </div>

                                    <div className="booking-info-row">
                                        <span className="info-icon"><CreditCard size={14} /></span>
                                        <span className="price">₹{booking.amount}</span>
                                    </div>

                                    {booking.bookingType !== "FOOD" && (
                                        <div className="booking-dates">
                                            <div className="date-box">
                                                <span className="label">Check-in</span>
                                                <span className="value">{formatDate(booking.checkIn)}</span>
                                            </div>
                                            <div className="date-arrow">➝</div>
                                            <div className="date-box">
                                                <span className="label">Check-out</span>
                                                <span className="value">{formatDate(booking.checkOut)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        className="btn-view-details"
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                            <X size={24} />
                        </button>

                        <div className="modal-header">
                            <h2>Booking Details</h2>
                            <span className={`status-badge-large ${selectedBooking.status.toLowerCase()}`}>
                                {selectedBooking.status}
                            </span>
                        </div>

                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Booking ID:</span>
                                <span className="detail-value">{selectedBooking._id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Property/Item:</span>
                                <span className="detail-value">
                                    {selectedBooking.bookingType === "PG"
                                        ? selectedBooking.pg?.name
                                        : selectedBooking.bookingType === "ROOM"
                                            ? selectedBooking.room?.name
                                            : selectedBooking.food?.name}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Amount Paid:</span>
                                <span className="detail-value price-highlight">₹{selectedBooking.amount}</span>
                            </div>

                            {selectedBooking.bookingType !== "FOOD" && (
                                <>
                                    <div className="detail-divider"></div>
                                    <div className="detail-dates">
                                        <div className="date-group">
                                            <Calendar size={18} />
                                            <div>
                                                <span>Check-In</span>
                                                <strong>{formatDate(selectedBooking.checkIn)}</strong>
                                            </div>
                                        </div>
                                        <div className="date-group">
                                            <Calendar size={18} />
                                            <div>
                                                <span>Check-Out</span>
                                                <strong>{formatDate(selectedBooking.checkOut)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedBooking.status !== "CANCELLED" && (
                                <div className="modal-actions">
                                    <button
                                        className="btn-cancel-booking"
                                        onClick={() => handleCancelBooking(selectedBooking._id)}
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;

