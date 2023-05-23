import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PaymentFailed() {
    const navigate = useNavigate();
    useEffect(() => {
          setTimeout(() => {
            navigate(`/`);
          }, 1000);
      }, []);

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>Redirecting to homepage...</p>
    </div>
  );
}

export default PaymentFailed;