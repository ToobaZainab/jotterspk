import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backUrl } from "../helpers/Url";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const [countdown, setCountdown] = useState(5);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const responseCode = searchParams.get("pp_ResponseCode");
    const txnRefNo = searchParams.get("pp_TxnRefNo");
    const amount = searchParams.get("pp_Amount");

    if (responseCode === "199") {
      // Update backend order status
      axios
        .post(`${backUrl()}/api/orders/payment/verify`, {
          txnRefNo,
          amount,
          orderId,
        })
        .then(() => {
          setStatus("Payment Successful!");
        })
        .catch(() => {
          setStatus("Payment Success, but Order Update Failed.");
        });
    } else {
      setStatus("Payment Failed or Cancelled.");
    }

    // Set up the redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/order/${orderId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, navigate, orderId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{status}</h1>
      <p>Redirecting you to order details in {countdown} seconds...</p>
    </div>
  );
};

export default PaymentSuccess;
