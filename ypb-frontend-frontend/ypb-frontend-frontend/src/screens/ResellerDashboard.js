import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import {
  CalendarClock,
  CheckCircle,
  DollarSign,
  Loader,
  Trash,
  Truck,
} from "lucide-react";
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

const ResellerDashboard = () => {
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

  const resellerOrders = orders.filter((order) => order.resellerProfit > 0);

  const pendingOrdersOfReseller = resellerOrders.filter(
    (order) => order.orderStatus === "Pending"
  );
  const shippedOrdersOfReseller = resellerOrders.filter(
    (order) => order.orderStatus === "Shipped"
  );
  const deliveredOrdersOfReseller = resellerOrders.filter(
    (order) => order.orderStatus === "Delivered"
  );
  const cancelledOrdersOfReseller = resellerOrders.filter(
    (order) => order.orderStatus === "Cancelled"
  );
  const totalProfit = deliveredOrdersOfReseller.reduce((accumulator, order) => {
    return accumulator + order.resellerProfit;
  }, 0);

  return (
    <>
      <Helmet>
        <title>Reseller Dashboard | Jotters Pk</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="admin_content bg-white mt-3 mb-3">
          <div className="stat_card_grid px-3">
            <div className="stat_card mt-2 bg-info p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_text">
                  <p>
                    <DollarSign size={24} strokeWidth={1.25} /> Total Earnings
                  </p>
                  <br />
                  <h4>{totalProfit}</h4>
                </div>
              </div>
            </div>
            <div className="stat_card mt-2 bg-info p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_text">
                  <p>
                    <CalendarClock size={24} strokeWidth={1.25} /> Total Orders
                  </p>
                  <br />
                  <h4>{resellerOrders.length}</h4>
                </div>
              </div>
            </div>
            <div className="stat_card mt-2 bg-info p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_text">
                  <p>
                    <Loader size={24} strokeWidth={1.25} /> Pending Orders
                  </p>
                  <br />
                  <h4>{pendingOrdersOfReseller.length}</h4>
                </div>
              </div>
            </div>
            <div className="stat_card mt-2 bg-info p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_text">
                  <p>
                    <Truck size={24} strokeWidth={1.25} /> Shipped Orders
                  </p>
                  <br />
                  <h4>{shippedOrdersOfReseller.length}</h4>
                </div>
              </div>
            </div>
            <div className="stat_card mt-2 bg-info p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_text">
                  <p>
                    <CheckCircle size={24} strokeWidth={1.25} /> Delivered
                    Orders
                  </p>
                  <br />
                  <h4>{deliveredOrdersOfReseller.length}</h4>
                </div>
              </div>
            </div>
            <div className="stat_card mt-2 bg-info p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_text">
                  <p>
                    <Trash size={24} strokeWidth={1.25} /> Cancelled Orders
                  </p>
                  <br />
                  <h4>{cancelledOrdersOfReseller.length}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className={totalProfit === 0 ? "d-none" : "mx-3"}>
            <Link
              className="btn btn-sm btn-light mt-2 p-2"
              to="/profile/withdraw"
            >
              Withdraw Amount<i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="table-responsive p-3">
            <h4>Your Orders</h4>
            {resellerOrders.length === 0 ? (
              <h4 className="mt-3">No Record Found</h4>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {resellerOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {order.user ? order.resellerName : "Deleted User"}
                      </td>
                      <td>
                        {new Date(order.createdAt).toString().substring(0, 15)}
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
                          type="button"
                          className="btn btn-sm btn-success"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResellerDashboard;
