import Axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import Spinner from "../components/Spinner";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      navigate("/cart");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [cart, navigate]);

  const [resellerName, setResellerName] = useState(userInfo?.name);
  const [resellerProfit, setResellerProfit] = useState(0);
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems?.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice >= 1499 ? round2(0) : round2(100);
  cart.taxPrice = 0;
  cart.totalPrice =
    cart.itemsPrice +
    cart.shippingPrice +
    cart.taxPrice +
    round2(resellerProfit);

  const placeOrderHandler = async () => {
    if (userInfo?.isReseller && resellerProfit < 1) {
      toast.error("Please enter your profit value");
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await Axios.post(
        `${backUrl()}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          resellerName: resellerName,
          resellerProfit: resellerProfit,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/ordersuccess?redirect=/order/${data.order._id}`);
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };
  const placeOrderHandlerMe = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await Axios.post(
        `${backUrl()}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          resellerName: resellerName,
          resellerProfit: resellerProfit,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Preview Order | Jotters Pk</title>
      </Helmet>
      <div className="container">
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
      </div>
      <div className="confirm_main_wrapper container mt-3 mb-3">
        <div className="order_details_confirm px-4">
          <div className="shipping_payment_wrapper">
            <div className="shipping_details_section p-2">
              <h5 className="mt-2">
                <i className="fa fa-truck" aria-hidden="true"></i> Shipping
                Details
              </h5>
              <hr />
              <p>{cart.shippingAddress.fullName}</p>
              <p>{cart.shippingAddress.mobile}</p>
              <p>{cart.shippingAddress.address}</p>
              <p>City, {cart.shippingAddress.city}</p>
              <p>{cart.shippingAddress.postalCode}</p>
              <p>{cart.shippingAddress.country}</p>
              <p className="text-end">
                <Link to="/shipping">
                  <button className="btn btn-sm btn-dark">Edit</button>
                </Link>
              </p>
            </div>
            <div className="payment_details_section p-2">
              <h5 className="mt-2">
                <i className="fa fa-money" aria-hidden="true"></i> Payment
                Method
              </h5>
              <hr />
              <li>{cart.paymentMethod}</li>
            </div>
          </div>
          <div className="ordered_items mt-2 p-2">
            <h5 className="mt-2 d-flex justify-content-between align-items-center">
              <span>
                <i className="fa fa-list-ol" aria-hidden="true"></i> Cart Items
              </span>
              <span className="text-end">
                <Link to="/cart">
                  <button className="btn btn-sm btn-dark">Edit</button>
                </Link>
              </span>
            </h5>
            <div className="order_item_wrapper border-bottom mt-2 mb-2 p-1">
              <p className="fs-6 fw-bold">Product(s)</p>
              <p className="fs-6 fw-bold">Qty</p>
              <p className="fs-6 fw-bold">Price</p>
            </div>
            {cart.cartItems?.map((item) => (
              <div className="order_item_wrapper border-bottom mt-1 mb-2 p-1">
                <div className="order_item d-flex justify-content-center align-items-center">
                  <Link to={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <Link to={`/product/${item.slug}`}>
                    <p className="px-2 text-dark">{item.name}</p>
                    <p
                      className={
                        item.colors?.length < 1
                          ? "d-none"
                          : "px-2 text-dark text-capitalize"
                      }
                    >
                      color : {item.colors}
                    </p>
                  </Link>
                </div>
                <h6>{item.quantity}</h6>
                <h6>{item.price}</h6>
              </div>
            ))}
          </div>
        </div>
        <div className="order_summary_confirm px-4">
          <div className="order_summary p-2 ">
            <h5 className="mt-2">Order Summary</h5>
            <hr />
            <div className="summary_grid mb-1">
              <span>Subtotal</span>
              <span>{cart.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary_grid mb-1">
              <span>Delivery Charges</span>
              <span>{cart.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="summary_grid border-bottom mb-3">
              <span>Tax/Charges</span>
              <span>{cart.taxPrice.toFixed(2)}</span>
            </div>
            {userInfo?.isReseller && (
              <div>
                <div className="summary_grid">
                  <span>Reseller Name</span>
                  <span>
                    <input
                      style={{
                        maxWidth: "140px",
                      }}
                      type="text"
                      required
                      value={resellerName}
                      onChange={(e) => setResellerName(e.target.value)}
                    />
                  </span>
                </div>
                <div className="summary_grid">
                  <span>Reseller Profit</span>
                  <span>
                    <input
                      style={{
                        maxWidth: "140px",
                      }}
                      type="Number"
                      required
                      value={resellerProfit}
                      onChange={(e) => setResellerProfit(e.target.value)}
                    />
                  </span>
                </div>
              </div>
            )}
            <div className="summary_grid">
              <span>Total</span>
              <span>{cart.totalPrice.toFixed(2)}</span>
            </div>
            {userInfo?.isReseller === true && (
              <button
                onClick={placeOrderHandler}
                disabled={
                  (resellerProfit === 0) &
                  (cart.cartItems?.length === 0) &
                  loading
                }
                className={
                  cart.cartItems?.length === 0 || resellerProfit < 1
                    ? "btn btn-outline-primary disabled w-100 mt-2"
                    : "btn btn-outline-primary w-100 mt-2"
                }
              >
                {loading ? <Spinner></Spinner> : "Sell it to customer"}
              </button>
            )}
            <div className="mt-3">
              <button
                onClick={placeOrderHandlerMe}
                disabled={cart.cartItems?.length === 0 && loading}
                className={
                  cart.cartItems?.length === 0
                    ? "btn btn-primary btn-disabled"
                    : "btn btn-primary w-100"
                }
              >
                {loading ? (
                  <Spinner></Spinner>
                ) : userInfo?.isReseller ? (
                  "Buy for Me"
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
