import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentSuccess(props) {
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();
  const paymentData = JSON.parse(localStorage.getItem('paymentData'))
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");


    if (sessionId) {
        const createBooking = 
        async () => { const bookingResponse = await axios.post("/success", { 
            sessionId,
            checkIn: paymentData.checkIn,
            checkOut: paymentData.checkOut,
            numberOfGuests: paymentData.numberOfGuests,
            name: paymentData.name,
            phone: paymentData.phone, 
            placeId:paymentData.place._id,
            amount: paymentData.numberOfNights * paymentData.place.price * 100,});
        const bookingId = bookingResponse.data.bookingId;
        setBookingId(bookingId);
      };
      createBooking();
    }
  }, [paymentData]);

  useEffect(() => {
    if (bookingId) {
      setTimeout(() => {
        navigate(`/account/bookings/${bookingId}`);
      }, 1000);
    }
  }, [bookingId, navigate]);

  return (
    <div>
      <h1>Payment successful!</h1>
      <p>Redirecting to your booking...</p>
    </div>
  );
}

export default PaymentSuccess;