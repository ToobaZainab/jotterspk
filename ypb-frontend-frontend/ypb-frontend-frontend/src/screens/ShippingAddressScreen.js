import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || "");
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [userInfo, navigate]);

  const email = userInfo?.email;
  const [mobile, setMobile] = useState(shippingAddress.mobile || "");
  const country = "Pakistan";
  const submitHandler = (e) => {
    e.preventDefault();
    if (mobile.length < 11 || mobile.length > 11) {
      return toast.error("Mobile Number should be 11 digits");
    }
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        email,
        address,
        city,
        mobile,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        email,
        address,
        city,
        mobile,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate("/placeorder");
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  useEffect(() => {
    ctxDispatch({ type: "SET_FULLBOX_OFF" });
  }, [ctxDispatch, fullBox]);

  return (
    <div>
      <Helmet>
        <title>Shipping Details | Jotters Pk</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="shipping_container container p-3 mt-3 mb-2">
        <h4
          style={{
            color: "#12a6cc",
          }}
        >
          Shipping and Payment
        </h4>
        <p>Please enter your shipping details and select a payment method.</p>
        <hr />
        <form onSubmit={submitHandler} className="shipping_form">
          <div className="shipping_fields fields--2">
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="fullname">
                Full Name
              </span>
              <input
                className="shipping_field__input"
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="lastname">
                Phone Number
              </span>
              <input
                className="shipping_field__input"
                type="tel"
                id="lastname"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="shipping_field">
            <span className="shipping_field__label" htmlFor="address">
              Complete Address
            </span>
            <input
              className="shipping_field__input"
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <div className="shipping_fields fields--3">
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="zipcode">
                Zip code
              </span>
              <input
                className="shipping_field__input"
                type="text"
                id="zipcode"
                // type="Number"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </label>
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="city">
                City
              </span>
              <input
                className="shipping_field__input"
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="state">
                Province
              </span>
              <input
                className="shipping_field__input"
                id="state"
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </label>
          </div>
          <label className="shipping_field">
            <span className="shipping_field__label" htmlFor="country">
              Country
            </span>
            <input
              className="shipping_field__input"
              id="country"
              type="text"
              readOnly
              defaultValue={"Pakistan"}
            />
          </label>
          <label className="shipping_field">
            <span className="shipping_field__label" htmlFor="country">
              Payment Method
            </span>
            <select
              required
              style={{ color: "#000" }}
              className="shipping_field__input"
              id="payment"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Pay Online</option>
            </select>
          </label>
          <button type="submit" className="shipping_button mt-1">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
