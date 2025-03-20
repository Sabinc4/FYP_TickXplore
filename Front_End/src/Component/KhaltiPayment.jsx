import React, { useState, useEffect } from "react";
import axios from "axios";

const KhaltiPayment = ({ type, id, seats }) => {
  const [price, setPrice] = useState(null);
  const khaltiPublicKey = "test_public_key_xxxxxxxxxxxxx"; // ✅ Use Khalti Test Key

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/booking/get-price", {
          type,
          id,
          seats
        });
        setPrice(response.data.price);
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };
    
    fetchPrice();
  }, [type, id, seats]);

  const initiatePayment = () => {
    if (!price) return alert("Price not found!");

    const config = {
      return_url: "http://localhost:3000/payment-success",
      website_url: "http://yourwebsite.com",
      amount: price * 100, // Khalti uses paisa (1 NPR = 100 paisa)
      purchase_order_id: id,
      purchase_order_name: type === "bus" ? "Bus Ticket" : "Vehicle Rental",
      customer_info: {
        name: "Test User",
        email: "test@example.com",
        phone: "9800000001",
      },
    };

    axios
      .post("https://khalti.com/api/v2/epayment/initiate/", config, {
        headers: { Authorization: `Key ${khaltiPublicKey}` },
      })
      .then((response) => {
        window.location.href = response.data.payment_url; // Redirect to Khalti Payment Page
      })
      .catch((error) => {
        console.error("Khalti Payment Error:", error);
      });
  };

  return (
    <div>
      {price !== null ? (
        <div>
          <p>Total Price: NPR {price}</p>
          <button onClick={initiatePayment} className="bg-purple-600 text-white p-2 rounded">
            Pay with Khalti
          </button>
        </div>
      ) : (
        <p>Loading price...</p>
      )}
    </div>
  );
};

export default KhaltiPayment;
