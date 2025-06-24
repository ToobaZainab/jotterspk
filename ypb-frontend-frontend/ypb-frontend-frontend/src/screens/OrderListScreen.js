import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Spinner from "./../components/Spinner";
import AdminSidebar from "../components/AdminSidebar";
import {
  Boxes,
  CalendarClock,
  CheckCircle,
  Loader,
  Trash,
  Truck,
  Undo2,
} from "lucide-react";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [allOrders, setAllOrders] = useState([]);
  const [userInput, setUserInput] = useState("");
  const filteredData = filterData(orders, userInput);

  function filterData(orders, userInput) {
    return orders?.filter((order) => {
      return (
        order?.user?.name.toLowerCase().includes(userInput.toLowerCase()) ||
        order?._id.toLowerCase().includes(userInput.toLowerCase())
      );
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${backUrl()}/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setAllOrders(data);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const pendingOrders = allOrders.filter(
    (order) => order.orderStatus === "Pending"
  );

  const shippedOrders = allOrders.filter(
    (order) => order.orderStatus === "Shipped"
  );

  const deliveredOrders = allOrders.filter(
    (order) => order.orderStatus === "Delivered"
  );

  const cancelledOrders = allOrders.filter(
    (order) => order.orderStatus === "Returned"
  );
  const returnOrders = allOrders.filter(
    (order) => order.orderStatus === "Returned"
  );
  let todayDate = new Date().toString().substring(0, 15);
  const ordersToday = allOrders.filter(
    (order) =>
      new Date(order.createdAt).toString().substring(0, 15) === todayDate
  );

  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`${backUrl()}/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("order deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>All Orders | Jotters Pk</title>
      </Helmet>
      <section className="admin_wrapper p-3">
        <div className="admin_sidebar bg-white p-2">
          <AdminSidebar />
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="admin_content bg-white">
            <div className="stat_card_grid mt-1 px-3">
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <Boxes size={24} strokeWidth={1.25} /> Total Orders
                    </p>
                    <br />
                    <h4>{allOrders.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <CalendarClock size={24} strokeWidth={1.25} /> Today's
                      Orders
                    </p>
                    <br />
                    <h4>{ordersToday.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <Loader size={24} strokeWidth={1.25} /> Pending Orders
                    </p>
                    <br />
                    <h4>{pendingOrders.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <Truck size={24} strokeWidth={1.25} /> Shipped Orders
                    </p>
                    <br />
                    <h4>{shippedOrders.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <CheckCircle size={24} strokeWidth={1.25} /> Delivered
                      Orders
                    </p>
                    <br />
                    <h4>{deliveredOrders.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <Trash size={24} strokeWidth={1.25} /> Cancelled Orders
                    </p>
                    <br />
                    <h4>{cancelledOrders.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <Undo2 size={24} strokeWidth={1.25} /> Return Orders
                    </p>
                    <br />
                    <h4>{returnOrders.length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid d-flex flex-wrap align-items-center gap-2 justify-content-between mt-2">
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="addon-wrapping">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control bg-light"
                  placeholder="Type to Search"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive p-3">
              {filteredData.length === 0 ? (
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
                    {filteredData.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.user ? order.user.name : "Deleted User"}</td>
                        <td>
                          {new Date(order.createdAt)
                            .toString()
                            .substring(0, 15)}
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
                          &nbsp;
                          <button
                            type="button"
                            disabled={loadingDelete}
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteHandler(order)}
                          >
                            {loadingDelete ? (
                              <Spinner></Spinner>
                            ) : (
                              <i className="bi bi-trash3-fill"></i>
                            )}
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
      </section>
    </>
  );
}
