import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/api";

const AdminDashboard = () => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "bookings";

    const [bookings, setBookings] = useState([]);
    const [pgs, setPgs] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [foods, setFoods] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [pgForm, setPgForm] = useState({ name: "", city: "", location: "", rent: "", type: "", image: "", description: "" });
    const [roomForm, setRoomForm] = useState({ name: "", price: "", city: "", location: "", image: "", type: "", description: "" });
    const [foodForm, setFoodForm] = useState({ name: "", price: "", image: "", type: "Veg", category: "Lunch", restaurantName: "", phone: "", location: "", description: "" });

    useEffect(() => {
        if (activeTab === "bookings") fetchBookings();
        if (activeTab === "pg") fetchPGs();
        if (activeTab === "room") fetchRooms();
        if (activeTab === "food") fetchFoods();
        if (activeTab === "contacts") fetchContacts();
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(response.data);
        } catch (error) {
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    const fetchPGs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/pgs`);
            setPgs(response.data);
        } catch (error) {
            console.error("Error fetching PGs", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/rooms`);
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching Rooms", error);
        }
    };

    const fetchFoods = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/food`);
            setFoods(response.data);
        } catch (error) {
            console.error("Error fetching Food", error);
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/api/contacts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(response.data);
        } catch (error) {
            toast.error("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/api/bookings/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const handleContactStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/api/contacts/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Marked as ${status}`);
            fetchContacts();
        } catch (error) {
            toast.error("Error updating contact status");
        }
    };

    const handleDeleteContact = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/api/contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Contact deleted");
            fetchContacts();
        } catch (error) {
            toast.error("Error deleting contact");
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/api/${type}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Item deleted successfully");
            if (type === "pgs") fetchPGs();
            if (type === "rooms") fetchRooms();
            if (type === "food") fetchFoods();
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    const handleAddPG = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...pgForm,
                images: pgForm.image.split(",").map((url) => url.trim()),
            };
            await axios.post(`${API_BASE_URL}/api/pgs`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("PG Added Successfully");
            setPgForm({ name: "", city: "", location: "", rent: "", type: "", image: "", description: "" });
            fetchPGs();
        } catch (error) {
            toast.error("Error adding PG");
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...roomForm,
                images: roomForm.image.split(",").map((url) => url.trim()),
            };
            await axios.post(`${API_BASE_URL}/api/rooms`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Room Added Successfully");
            setRoomForm({ name: "", price: "", city: "", location: "", image: "", type: "", description: "" });
            fetchRooms();
        } catch (error) {
            toast.error("Error adding Room");
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/api/food`, foodForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Food Added Successfully");
            setFoodForm({ name: "", price: "", image: "", type: "Veg", category: "Lunch", restaurantName: "", phone: "", location: "", description: "" });
            fetchFoods();
        } catch (error) {
            toast.error("Error adding Food");
        }
    };

    const statusColor = (s) => {
        if (s === "UNREAD") return { bg: "#fff3cd", color: "#664d03" };
        if (s === "READ") return { bg: "#cfe2ff", color: "#084298" };
        if (s === "REPLIED") return { bg: "#d1e7dd", color: "#0f5132" };
        return { bg: "#eee", color: "#333" };
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: "100px", paddingBottom: "50px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "1200px", width: "95%" }}>
                <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <h1 style={{ marginBottom: "30px", color: "#1a1a1a", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>Admin Dashboard</h1>

                    {/* Content Area */}
                    <div>

                        {/* TAB: BOOKINGS */}
                        {activeTab === "bookings" && (
                            <div>
                                <h2 style={{ marginBottom: "20px", color: "#ff385c" }}>Recent Bookings</h2>
                                {loading ? <p>Loading...</p> : (
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                                            <thead>
                                                <tr style={{ background: "#f8f9fa", color: "#333", textAlign: "left" }}>
                                                    <th style={{ padding: "15px", borderRadius: "8px 0 0 8px" }}>User</th>
                                                    <th style={{ padding: "15px" }}>Type</th>
                                                    <th style={{ padding: "15px" }}>Item</th>
                                                    <th style={{ padding: "15px" }}>Amount</th>
                                                    <th style={{ padding: "15px" }}>Status</th>
                                                    <th style={{ padding: "15px", borderRadius: "0 8px 8px 0" }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map((b) => (
                                                    <tr key={b._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                        <td style={{ padding: "15px" }}>
                                                            <div style={{ fontWeight: "600" }}>{b.user?.fullName}</div>
                                                            <div style={{ fontSize: "12px", color: "#888" }}>{b.user?.email}</div>
                                                        </td>
                                                        <td style={{ padding: "15px" }}>{b.bookingType}</td>
                                                        <td style={{ padding: "15px" }}>{b.pg?.name || b.room?.name || b.food?.name}</td>
                                                        <td style={{ padding: "15px" }}>₹{b.amount}</td>
                                                        <td style={{ padding: "15px" }}>
                                                            <span style={{
                                                                fontWeight: "600",
                                                                padding: "4px 10px",
                                                                borderRadius: "20px",
                                                                fontSize: "12px",
                                                                color: b.status === "CONFIRMED" ? "#0f5132" : b.status === "PENDING" ? "#664d03" : "#842029",
                                                                background: b.status === "CONFIRMED" ? "#d1e7dd" : b.status === "PENDING" ? "#fff3cd" : "#f8d7da"
                                                            }}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "15px" }}>
                                                            {b.status === "PENDING" && (
                                                                <div style={{ display: "flex", gap: "8px" }}>
                                                                    <button onClick={() => handleUpdateStatus(b._id, "CONFIRMED")} style={{ padding: "6px 12px", background: "#198754", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Accept</button>
                                                                    <button onClick={() => handleUpdateStatus(b._id, "CANCELLED")} style={{ padding: "6px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Reject</button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: CONTACTS */}
                        {activeTab === "contacts" && (
                            <div>
                                <h2 style={{ marginBottom: "20px", color: "#ff385c" }}>📬 Contact Messages</h2>
                                {loading ? <p>Loading...</p> : contacts.length === 0 ? (
                                    <p style={{ color: "#888", fontStyle: "italic" }}>No contact messages yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        {contacts.map((c) => (
                                            <div key={c._id} style={{
                                                background: c.status === "UNREAD" ? "#fffbeb" : "#f9fafb",
                                                border: c.status === "UNREAD" ? "1px solid #fde68a" : "1px solid #eee",
                                                borderRadius: "14px",
                                                padding: "20px",
                                                transition: "all 0.2s"
                                            }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                                                    <div>
                                                        <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", color: "#222" }}>{c.name}</h3>
                                                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>{c.email} · {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                                    </div>
                                                    <span style={{
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        background: statusColor(c.status).bg,
                                                        color: statusColor(c.status).color,
                                                    }}>{c.status}</span>
                                                </div>

                                                {c.subject && <p style={{ margin: "0 0 8px", fontWeight: "600", color: "#333" }}>Subject: {c.subject}</p>}
                                                <p style={{ margin: "0 0 16px", color: "#555", lineHeight: "1.6" }}>{c.message}</p>

                                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                    {c.status === "UNREAD" && (
                                                        <button onClick={() => handleContactStatus(c._id, "READ")} style={{ padding: "6px 14px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem" }}>Mark as Read</button>
                                                    )}
                                                    {c.status !== "REPLIED" && (
                                                        <button onClick={() => handleContactStatus(c._id, "REPLIED")} style={{ padding: "6px 14px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem" }}>Mark as Replied</button>
                                                    )}
                                                    <button onClick={() => handleDeleteContact(c._id)} style={{ padding: "6px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem" }}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: ADD PG */}
                        {activeTab === "pg" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                {/* Form Section */}
                                <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                                    <h2 style={{ marginBottom: "20px", color: "#ff385c", textAlign: "center" }}>Add New PG</h2>
                                    <form onSubmit={handleAddPG} className="contact-form" style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>
                                        <input placeholder="PG Name" value={pgForm.name} onChange={(e) => setPgForm({ ...pgForm, name: e.target.value })} required />
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input placeholder="City" value={pgForm.city} onChange={(e) => setPgForm({ ...pgForm, city: e.target.value })} required style={{ flex: 1 }} />
                                            <input placeholder="Location" value={pgForm.location || ""} onChange={(e) => setPgForm({ ...pgForm, location: e.target.value })} required style={{ flex: 1 }} />
                                            <input placeholder="Rent" value={pgForm.rent} onChange={(e) => setPgForm({ ...pgForm, rent: e.target.value })} required style={{ flex: 1 }} />
                                        </div>
                                        <select value={pgForm.type} onChange={(e) => setPgForm({ ...pgForm, type: e.target.value })} required style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}>
                                            <option value="">Select Type</option>
                                            <option value="Boys">Boys</option>
                                            <option value="Girls">Girls</option>
                                            <option value="Co-Living">Co-Living</option>
                                        </select>
                                        <input placeholder="Image URLs (comma separated)" value={pgForm.image} onChange={(e) => setPgForm({ ...pgForm, image: e.target.value })} required />
                                        <textarea placeholder="Description" value={pgForm.description} onChange={(e) => setPgForm({ ...pgForm, description: e.target.value })} rows="4" style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }} />
                                        <button type="submit" style={{ padding: "12px", background: "#ff385c", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px" }}>Add PG</button>
                                    </form>
                                </div>

                                {/* List Section */}
                                <div>
                                    <h2 style={{ marginBottom: "20px", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Existing PGs</h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                        {pgs.map((pg) => (
                                            <div key={pg._id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", border: "1px solid #eee", transition: "transform 0.2s" }}>
                                                <div style={{ position: "relative", height: "180px" }}>
                                                    <img
                                                        src={pg.images?.[0] || pg.image}
                                                        onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
                                                        alt={pg.name}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                    <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{pg.type}</span>
                                                </div>
                                                <div style={{ padding: "15px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                                                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>{pg.name}</h3>
                                                        <div style={{ display: "flex", gap: "5px" }}>
                                                            <Link to={`/admin/pg/view/${pg._id}`} style={{ color: "#198754", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="View">
                                                                👁️
                                                            </Link>
                                                            <Link to={`/admin/pg/edit/${pg._id}`} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Edit">
                                                                ✏️
                                                            </Link>
                                                            <button onClick={() => handleDelete(pg._id, "pgs")} style={{ color: "#dc3545", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Delete">
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p style={{ margin: "0 0 5px", color: "#666", fontSize: "0.9rem" }}>📍 {pg.city}{pg.location ? `, ${pg.location}` : ""}</p>
                                                    <p style={{ margin: 0, color: "#ff385c", fontWeight: "bold", fontSize: "1.1rem" }}>₹{pg.rent}<span style={{ fontSize: "0.8rem", color: "#999", fontWeight: "normal" }}>/month</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: ADD ROOM */}
                        {activeTab === "room" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                                    <h2 style={{ marginBottom: "20px", color: "#ff385c", textAlign: "center" }}>Add New Room</h2>
                                    <form onSubmit={handleAddRoom} className="contact-form" style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>
                                        <input placeholder="Room Name" value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} required />
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input placeholder="Price" value={roomForm.price} onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })} required style={{ flex: 1 }} />
                                            <select value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })} style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}>
                                                <option value="">Select Configuration</option>
                                                <option value="Single">Single</option>
                                                <option value="Double">Double</option>
                                                <option value="Triple">Triple</option>
                                            </select>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input placeholder="City" value={roomForm.city || ""} onChange={(e) => setRoomForm({ ...roomForm, city: e.target.value })} required style={{ flex: 1 }} />
                                            <input placeholder="Location" value={roomForm.location || ""} onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })} required style={{ flex: 1 }} />
                                        </div>
                                        <input placeholder="Image URLs (comma separated)" value={roomForm.image} onChange={(e) => setRoomForm({ ...roomForm, image: e.target.value })} required />
                                        <textarea placeholder="Description" value={roomForm.description || ""} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} rows="4" style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }} />
                                        <button type="submit" style={{ padding: "12px", background: "#ff385c", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px" }}>Add Room</button>
                                    </form>
                                </div>

                                <div>
                                    <h2 style={{ marginBottom: "20px", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Existing Rooms</h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                        {rooms.map((room) => (
                                            <div key={room._id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
                                                <div style={{ position: "relative", height: "180px" }}>
                                                    <img
                                                        src={room.images?.[0] || room.image}
                                                        onError={(e) => e.target.src = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&w=800"}
                                                        alt={room.name}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                    <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{room.type}</span>
                                                </div>
                                                <div style={{ padding: "15px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                                                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>{room.name}</h3>
                                                        <div style={{ display: "flex", gap: "5px" }}>
                                                            <Link to={`/admin/room/view/${room._id}`} style={{ color: "#198754", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="View">
                                                                👁️
                                                            </Link>
                                                            <Link to={`/admin/room/edit/${room._id}`} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Edit">
                                                                ✏️
                                                            </Link>
                                                            <button onClick={() => handleDelete(room._id, "rooms")} style={{ color: "#dc3545", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Delete">
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {room.city && <p style={{ margin: "0 0 5px", color: "#666", fontSize: "0.9rem" }}>📍 {room.city}{room.location ? `, ${room.location}` : ""}</p>}
                                                    <p style={{ margin: 0, color: "#ff385c", fontWeight: "bold", fontSize: "1.1rem" }}>₹{room.price}<span style={{ fontSize: "0.8rem", color: "#999", fontWeight: "normal" }}>/night</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: ADD FOOD */}
                        {activeTab === "food" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                                    <h2 style={{ marginBottom: "20px", color: "#ff385c", textAlign: "center" }}>Add Food Item</h2>
                                    <form onSubmit={handleAddFood} className="contact-form" style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>
                                        <input placeholder="Item Name" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} required />
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input type="number" placeholder="Price" value={foodForm.price} onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })} required style={{ flex: 1 }} />
                                            <select value={foodForm.type} onChange={(e) => setFoodForm({ ...foodForm, type: e.target.value })} required style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}>
                                                <option value="Veg">Veg</option>
                                                <option value="Non-Veg">Non-Veg</option>
                                            </select>
                                        </div>
                                        <select value={foodForm.category} onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })} required style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}>
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Snacks">Snacks</option>
                                            <option value="Beverages">Beverages</option>
                                        </select>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input placeholder="Restaurant/Dhaba Name" value={foodForm.restaurantName || ""} onChange={(e) => setFoodForm({ ...foodForm, restaurantName: e.target.value })} style={{ flex: 1 }} />
                                            <input placeholder="Phone Number" value={foodForm.phone || ""} onChange={(e) => setFoodForm({ ...foodForm, phone: e.target.value })} style={{ flex: 1 }} />
                                        </div>
                                        <input placeholder="Location" value={foodForm.location || ""} onChange={(e) => setFoodForm({ ...foodForm, location: e.target.value })} />
                                        <input placeholder="Image URL" value={foodForm.image} onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })} required />
                                        <textarea placeholder="Description" value={foodForm.description || ""} onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })} rows="3" style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }} />
                                        <button type="submit" style={{ padding: "12px", background: "#ff385c", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px" }}>Add Food</button>
                                    </form>
                                </div>

                                <div>
                                    <h2 style={{ marginBottom: "20px", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Existing Food Items</h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                        {foods.map((item) => (
                                            <div key={item._id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
                                                <div style={{ position: "relative", height: "180px" }}>
                                                    <img
                                                        src={item.image}
                                                        onError={(e) => e.target.src = "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&w=800"}
                                                        alt={item.name}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                    <span style={{ position: "absolute", top: "10px", right: "10px", background: item.type === "Veg" ? "#198754" : "#dc3545", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{item.type}</span>
                                                </div>
                                                <div style={{ padding: "15px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                                                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>{item.name}</h3>
                                                        <div style={{ display: "flex", gap: "5px" }}>
                                                            <Link to={`/admin/food/view/${item._id}`} style={{ color: "#198754", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="View">
                                                                👁️
                                                            </Link>
                                                            <Link to={`/admin/food/edit/${item._id}`} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Edit">
                                                                ✏️
                                                            </Link>
                                                            <button onClick={() => handleDelete(item._id, "food")} style={{ color: "#dc3545", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Delete">
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p style={{ margin: "0 0 5px", color: "#666", fontSize: "0.9rem" }}>🍽️ {item.category}</p>
                                                    {item.restaurantName && <p style={{ margin: "0 0 5px", color: "#555", fontSize: "0.85rem", fontStyle: "italic" }}>🏪 {item.restaurantName}</p>}
                                                    {item.location && <p style={{ margin: "0 0 5px", color: "#555", fontSize: "0.85rem" }}>📍 {item.location}</p>}
                                                    <p style={{ margin: 0, color: "#ff385c", fontWeight: "bold", fontSize: "1.1rem" }}>₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
