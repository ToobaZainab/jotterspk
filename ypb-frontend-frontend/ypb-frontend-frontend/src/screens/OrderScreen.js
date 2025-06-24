import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { backUrl } from "../helpers/Url";
import JazzCashButton from "../helpers/JazzCashButton";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "ORDER_REQUEST":
      return { ...state, loadingStatus: true };
    case "ORDER_SUCCESS":
      return { ...state, loadingStatus: false, successStatus: true };
    case "ORDER_FAIL":
      return { ...state, loadingStatus: false };
    case "ORDER_RESET":
      return {
        ...state,
        loadingStatus: false,
        successStatus: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [orderStatus, setOrderStatus] = useState("");

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, loadingStatus, successStatus, error, order }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingStatus: false,
      order: {},
      error: "",
    });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${backUrl()}/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || successStatus || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successStatus) {
        dispatch({ type: "ORDER_RESET" });
      }
    }
  }, [order, userInfo, orderId, successStatus, navigate]);

  const changeOrderStatus = async (e) => {
    e.preventDefault();
    if (!orderStatus) {
      toast.error("Please choose a status");
      return;
    }
    try {
      dispatch({ type: "ORDER_REQUEST" });
      const { data } = await axios.put(
        `${backUrl()}/api/orders/${order._id}/status`,
        {
          orderStatus,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "ORDER_SUCCESS", payload: data });
      toast.success("Status Updated");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "ORDER_FAIL" });
    }
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId} | Jotters Pk</title>
      </Helmet>
      <h4 className="mt-2 mb-2 text-center">
        <span
          style={{
            fontSize: "16px",
          }}
        >
          <Link to="/admin/orders">
            <i className="fa fa-arrow-left"></i>
          </Link>
        </span>
        &nbsp;
        <span>Order #{orderId}</span>
      </h4>
      <div className="confirm_main_wrapper container mt-3 mb-3">
        <div className="order_details_confirm px-4">
          <div className="shipping_payment_wrapper">
            <div className="shipping_details_section p-2">
              <h5 className="mt-2">
                <i className="fa fa-truck" aria-hidden="true"></i> Shipping
                Details
              </h5>
              <hr />
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.mobile}</p>
              <p>{order.shippingAddress.address}</p>
              <p>City, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div className="payment_details_section p-2">
              <h5 className="mt-2">
                <i className="fa fa-money" aria-hidden="true"></i> Payment
                Method
              </h5>
              <hr />
              <li>{order.paymentMethod}</li>
            </div>
          </div>
          <div className="ordered_items mt-2 p-2">
            <h5 className="mt-2 d-flex justify-content-between align-items-center">
              <span>
                <i className="fa fa-list-ol" aria-hidden="true"></i> Cart Items
              </span>
            </h5>
            <div className="order_item_wrapper border-bottom mt-2 mb-2 p-1">
              <p className="fs-6 fw-bold">Product(s)</p>
              <p className="fs-6 fw-bold">Qty</p>
              <p className="fs-6 fw-bold">Price</p>
            </div>
            {order.orderItems?.map((item) => (
              <div
                key={order?._id}
                className="order_item_wrapper border-bottom mt-1 mb-2 p-1"
              >
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
              <span>{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary_grid mb-1">
              <span>Delivery Charges</span>
              <span>{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div
              className={
                order.resellerProfit > 0 ? "summary_grid mb-1" : "d-none"
              }
            >
              <span>Reseller Name:</span>
              <span>{order.resellerName}</span>
            </div>
            <div
              className={
                order.resellerProfit > 0 ? "summary_grid mb-1" : "d-none"
              }
            >
              <span>Reseller Profit:</span>
              <span>{order.resellerProfit}</span>
            </div>
            <div className="summary_grid border-bottom mb-3">
              <span>Tax/Charges</span>
              <span>{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="summary_grid">
              <span>Total</span>
              <span>{order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="mt-2 mb-2">
              <MessageBox variant={order.isPaid ? "success" : "danger"}>
                Current Status : {order.isPaid ? "Paid" : "Not Paid"}
              </MessageBox>
            </div>
            {!order.isPaid && (
              <div className="mt-2 mb-2">
                <JazzCashButton orderId={order._id} amount={order.totalPrice} />
              </div>
            )}

            <div className="mt-2 mb-2">
              <MessageBox>Current Status : {order.orderStatus}</MessageBox>
            </div>
            {userInfo.isAdmin && (
              <div
                className={order.orderStatus === "Returned" ? "d-none" : "mt-3"}
              >
                <div className="input-group">
                  <select
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="form-select"
                    id="inputGroupSelect04"
                    aria-label="Example select with button addon"
                    defaultValue={order.orderStatus}
                  >
                    <option value="">Choose Status</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                  <button
                    disabled={loadingStatus}
                    onClick={changeOrderStatus}
                    className="btn btn-outline-secondary"
                    type="button"
                  >
                    {loadingStatus ? <Spinner></Spinner> : "Update"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
