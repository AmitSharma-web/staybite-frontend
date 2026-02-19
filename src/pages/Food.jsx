import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MapPin, Utensils } from "lucide-react";
import API_BASE_URL from "../utils/api";

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/food`);
        const data = await response.json();
        setFoodItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Food:", error);
        setLoading(false);
      }
    };

    fetchFood();
  }, []);

  const handleOrderNow = async (food) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to order food");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          food: food._id,
          bookingType: "FOOD",
          amount: food.price,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Food ordered successfully! 🍔");
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f8f9fa" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", color: "#333" }}>Loading Delicious Menu...</h2>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      padding: "100px 20px 50px",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: "10px"
          }}>
            Our <span style={{ color: "#ff385c" }}>Delicious Menu</span>
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Freshly prepared meals delivered to your room.
          </p>
        </div>

        {/* Grid Container */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px",
          paddingBottom: "40px"
        }}>
          {foodItems.map((food) => (
            <div key={food._id} style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
              }}
            >
              {/* Image Section */}
              <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                <img
                  src={food.image}
                  alt={food.name}
                  onError={(e) => e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                <span style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: food.type === "Veg" ? "#2ecc71" : "#e74c3c",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "0.80rem",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}>
                  {food.type || "Veg"}
                </span>
              </div>

              {/* Content Section */}
              <div style={{ padding: "24px", flex: "1", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <h2 style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#222",
                    margin: "0",
                    lineHeight: "1.3"
                  }}>
                    {food.name}
                  </h2>
                  <p style={{ color: "#ff385c", fontWeight: "700", fontSize: "1.2rem", margin: "0" }}>
                    ₹{food.price}
                  </p>
                </div>

                {/* Restaurant Info */}
                {(food.restaurantName || food.location) && (
                  <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {food.restaurantName && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#444", fontSize: "0.9rem", fontWeight: "600" }}>
                        <Utensils size={14} color="#ff385c" />
                        <span>{food.restaurantName}</span>
                      </div>
                    )}
                    {food.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#666", fontSize: "0.85rem" }}>
                        <MapPin size={14} color="#888" />
                        <span>{food.location}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: "15px" }}>
                  <span style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    background: "#f0f2f5",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    display: "inline-block"
                  }}>
                    {food.category}
                  </span>
                </div>

                <p style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  flex: "1",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {food.description || "A delicious meal prepared with fresh ingredients."}
                </p>

                <div style={{ marginTop: "auto", borderTop: "1px solid #f0f0f0", paddingTop: "20px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => window.location.href = `/food/${food._id}`}
                    style={{
                      flex: 1,
                      background: "white",
                      color: "#1a1a1a",
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      border: "1px solid #e5e7eb",
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOrderNow(food)}
                    style={{
                      flex: 1,
                      background: "#222",
                      color: "white",
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.3s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#ff385c"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#222"}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Food;
