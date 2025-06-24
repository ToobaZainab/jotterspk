import React from "react";
import axios from "axios";
import { backUrl } from "./Url";

const JazzCashButton = ({ orderId, amount }) => {
  // const formRef = useRef();

  const handleJazzCashPayment = async () => {
    try {
      const { data } = await axios.post(`${backUrl()}/api/orders/init`, {
        orderId,
        amount,
      });

      // ✅ Debug logs
      console.log("JazzCash action URL:", data.actionUrl);
      console.log("Form fields:", data.fields);

      // ✅ Optional: open JazzCash URL in new tab (for testing)
      // This won't work fully unless it receives a POST form
      // window.open(data.actionUrl, "_blank");

      // Create and submit form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.actionUrl;

      for (const key in data.fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data.fields[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("JazzCash Payment Error:", err);
      alert("Failed to start payment process.");
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleJazzCashPayment}>
      Pay with JazzCash
    </button>
  );
};

export default JazzCashButton;
