import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";
import {loadStripe} from "@stripe/stripe-js";
import {useNavigate} from "react-router-dom";

export default function BookingWidget({place}) {

  const stripePromise = loadStripe('pk_test_bke7ZCU9G0pBoguB3PqRnx4I00qcCDDlkW');

  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  const [isBookingDisabled, setIsBookingDisabled] = useState(false);
  
  useEffect(() => {

    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  function isFormValid() {
    return checkIn && checkOut && checkOut > checkIn && name && phone;
  }

  const notLoggedIn = () => {
    navigate('/login');
  };

  async function bookThisPlace(onSuccess) {   

    if (!user) {
      alert("Please log in.");
      notLoggedIn();
      return;
    }



    if (!isFormValid() && user) {
      alert("Please fill in all the required fields.");
      return;
    }

    setIsBookingDisabled(true);

    const stripe = await stripePromise;

    const { data } = await axios.post("/create-payment-intent", {
      amount: numberOfNights * place.price * 100,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      placeId: place._id,
    });
    localStorage.setItem('paymentData', JSON.stringify({ checkIn, checkOut, numberOfGuests, name, phone, place, }));

    const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  
    if (result.error) {
      console.error(result.error.message);
      setIsBookingDisabled(false);
    }
  }



  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
            value={checkIn}
            onChange={ev => setCheckIn(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
  </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number"
                 value={numberOfGuests}
                 onChange={ev => setNumberOfGuests(ev.target.value)}/>
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>Phone number:</label>
            <input type="tel"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}