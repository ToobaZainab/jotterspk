import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders = [] }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const allOrders = orders.filter((order) => order.resellerProfit < 1);

  const pendingOrders = allOrders.filter(
    (order) => order.orderStatus === "Pending"
  );
  const shippedOrders = allOrders.filter(
    (order) => order.orderStatus === "Shipped"
  );
  const deliveredOrders = allOrders.filter(
    (order) => order.orderStatus === "Delivered"
  );
  const cancelOrders = allOrders.filter(
    (order) => order.orderStatus === "Cancelled"
  );

  return (
    <div>
      <Helmet>
        <title>My Orders | Jotters Pk</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <h3 className="px-3 mt-2">Order History</h3>
          <div className="container-fluid mt-3 mb-2">
            <div className="tab-container bg-white p-2">
              <input
                type="radio"
                name="tabs"
                id="tab1"
                className="tab"
                defaultChecked
              />
              <label htmlFor="tab1">All</label>
              <input type="radio" name="tabs" id="tab2" className="tab" />
              <label htmlFor="tab2">Pending</label>
              <input type="radio" name="tabs" id="tab3" className="tab" />
              <label htmlFor="tab3">Shipped</label>
              <input type="radio" name="tabs" id="tab4" className="tab" />
              <label htmlFor="tab4">Delivered</label>
              <input type="radio" name="tabs" id="tab5" className="tab" />
              <label htmlFor="tab5">Cancelled</label>
              <div
                className="tab-content table-responsive mt-2"
                id="content-tab1"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"># id</th>
                      <th scope="col">Date</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link
                            className="text-dark"
                            to={`/order/${order._id}`}
                          >
                            {order._id}
                          </Link>
                        </td>
                        <td>
                          {new Date(order.createdAt)
                            .toString()
                            .substring(0, 25)}
                        </td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>
                          <span
                            className={
                              order.orderStatus === "Pending"
                                ? "badge text-bg-info"
                                : order.orderStatus === "Shipped"
                                ? "badge text-bg-warning"
                                : order.orderStatus === "Delivered"
                                ? "badge text-bg-success"
                                : order.orderStatus === "Cancelled"
                                ? "badge text-bg-danger"
                                : "badge text-bg-dark"
                            }
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              navigate(`/order/${order._id}`);
                            }}
                            className="btn btn-sm btn-info"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="tab-content table-responsive mt-2"
                id="content-tab2"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"># id</th>
                      <th scope="col">Date</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link
                            className="text-dark"
                            to={`/order/${order._id}`}
                          >
                            {order._id}
                          </Link>
                        </td>
                        <td>
                          {new Date(order.createdAt)
                            .toString()
                            .substring(0, 25)}
                        </td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>{order.orderStatus}</td>
                        <td>
                          <button
                            onClick={() => {
                              navigate(`/order/${order._id}`);
                            }}
                            className="btn btn-sm btn-info"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="tab-content table-responsive mt-2"
                id="content-tab3"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"># id</th>
                      <th scope="col">Date</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippedOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link
                            className="text-dark"
                            to={`/order/${order._id}`}
                          >
                            {order._id}
                          </Link>
                        </td>
                        <td>
                          {new Date(order.createdAt)
                            .toString()
                            .substring(0, 25)}
                        </td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>{order.orderStatus}</td>
                        <td>
                          <button
                            onClick={() => {
                              navigate(`/order/${order._id}`);
                            }}
                            className="btn btn-sm btn-info"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="tab-content table-responsive mt-2"
                id="content-tab4"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"># id</th>
                      <th scope="col">Date</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link
                            className="text-dark"
                            to={`/order/${order._id}`}
                          >
                            {order._id}
                          </Link>
                        </td>
                        <td>
                          {new Date(order.createdAt)
                            .toString()
                            .substring(0, 25)}
                        </td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>{order.orderStatus}</td>
                        <td>
                          <button
                            onClick={() => {
                              navigate(`/order/${order._id}`);
                            }}
                            className="btn btn-sm btn-info"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="tab-content table-responsive mt-2"
                id="content-tab5"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"># id</th>
                      <th scope="col">Date</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link
                            className="text-dark"
                            to={`/order/${order._id}`}
                          >
                            {order._id}
                          </Link>
                        </td>
                        <td>
                          {new Date(order.createdAt)
                            .toString()
                            .substring(0, 25)}
                        </td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>{order.orderStatus}</td>
                        <td>
                          <button
                            onClick={() => {
                              navigate(`/order/${order._id}`);
                            }}
                            className="btn btn-sm btn-info"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
