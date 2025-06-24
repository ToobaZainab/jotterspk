import React, { useContext, useEffect, useReducer } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Boxes, PackageSearch, Users2, Wallet } from "lucide-react";
import AdminSidebar from "./../components/AdminSidebar";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backUrl()}/api/orders/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const userId = userInfo?._id;

  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        dispatch({ type: "FETCH_REQUEST_USER" });
        try {
          const { data } = await axios.get(`${backUrl()}/api/users/mine/${userId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS_USER", payload: data });
          if (userInfo.isAdmin !== data.isAdmin) {
            ctxDispatch({ type: "USER_SIGNOUT" });
            localStorage.removeItem("userInfo");
            localStorage.removeItem("shippingAddress");
            localStorage.removeItem("paymentMethod");
            localStorage.removeItem("cartItems");
            window.location.href = "/signin";
          }
        } catch (error) {
          dispatch({
            type: "FETCH_FAIL_USER",
            payload: getError(error),
          });
        }
      };
      fetchData();
    }
  }, [userId, userInfo, ctxDispatch]);

  const pieoptions = {
    title: "Categories",
    pieHole: 0.4,
    is3D: true,
  };

  const tableoptions = {
    legend: { position: "bottom" },
    pageSize: 10,
  };

  const baroptions = {
    chart: {
      title: "Sales Chart",
    },
  };
  const barchartoptions = {
    title: "Sales per date",
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Jotters Pk</title>
      </Helmet>
      <section className="admin_wrapper mt-1 p-3">
        <div className="admin_sidebar bg-white p-2">
          <AdminSidebar />
        </div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="admin_content">
            <div className="stat_card_grid">
              <div className="stat_card bg-white p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_icon">
                    <Link to="/admin/dashboard">
                      <Wallet size={36} color="#ffffff" />
                    </Link>
                  </div>
                  <div className="stat_card_text">
                    <p>Total Sales</p>
                    <h4>
                      {summary.orders && summary.orders[0]
                        ? summary.orders[0].totalSales.toFixed(2)
                        : 0}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-white p-3">
                <div className="d-flex  align-items-center gap-3">
                  <div className="stat_card_icon">
                    <Link to="/admin/products">
                      <PackageSearch size={36} color="#ffffff" />
                    </Link>
                  </div>
                  <div className="stat_card_text">
                    <p>Total Products</p>
                    <h4>
                      {summary.products && summary.products[0]
                        ? summary.products[0].totalProducts
                        : 0}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-white p-3">
                <div className="d-flex  align-items-center gap-3">
                  <div className="stat_card_icon">
                    <Link to="/admin/users">
                      <Users2 size={36} color="#ffffff" />
                    </Link>
                  </div>
                  <div className="stat_card_text">
                    <p>Total Users</p>
                    <h4>
                      {summary.users && summary.users[0]
                        ? summary.users[0].numUsers
                        : 0}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-white p-3">
                <div className="d-flex  align-items-center gap-3">
                  <div className="stat_card_icon">
                    <Link to="/admin/orders">
                      <Boxes size={36} color="#ffffff" />
                    </Link>
                  </div>
                  <div className="stat_card_text">
                    <p>Total Orders</p>
                    <h4>
                      {summary.orders && summary.orders[0]
                        ? summary.orders[0].numOrders
                        : 0}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard_charts_grid">
              <p
                style={{
                  fontSize: "11px",
                }}
                className="d-md-none mt-2 text-center"
              >
                <i className="fa fa-info-circle" aria-hidden="true"></i> For
                better view of charts , open in desktop or laptop.
              </p>
              <div className="chart_wrapper">
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Sale</MessageBox>
                ) : (
                  <Chart
                    style={{ overflow: "auto" }}
                    width="100%"
                    height="100%"
                    chartType="AreaChart"
                    options={baroptions}
                    loader={<LoadingBox />}
                    data={[
                      ["Date", "Sales"],
                      ...summary.dailyOrders.map((x) => [
                        x._id.toString().substring(5),
                        x.sales,
                      ]),
                    ]}
                  ></Chart>
                )}
              </div>
              <div className="chart_wrapper">
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Sale</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="100%"
                    chartType="BarChart"
                    options={barchartoptions}
                    loader={<LoadingBox />}
                    data={[
                      ["Date", "Sales", "Number of Orders"],
                      ...summary.dailyOrders.map((x) => [
                        x._id.toString(),
                        x.sales,
                        x.orders,
                      ]),
                    ]}
                  ></Chart>
                )}
              </div>
              <div className="chart_wrapper">
                {summary.dailyOrders.length !== 0 && (
                  <Chart
                    height="100%"
                    width="100%"
                    chartType="Table"
                    options={tableoptions}
                    loader={<LoadingBox />}
                    data={[
                      ["Date", "Sales", "Number of Orders"],
                      ...summary.dailyOrders.map((x) => [
                        x._id.toString(),
                        x.sales,
                        x.orders,
                      ]),
                    ]}
                  ></Chart>
                )}
              </div>
              <div className="chart_wrapper">
                {summary.productCategories.length === 0 ? (
                  <MessageBox>No Category</MessageBox>
                ) : (
                  <Chart
                    height={"100%"}
                    width={"100%"}
                    chartType="PieChart"
                    loader={<LoadingBox />}
                    options={pieoptions}
                    data={[
                      ["Category", "Products"],
                      ...summary.productCategories.map((x) => [x._id, x.count]),
                    ]}
                  ></Chart>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
