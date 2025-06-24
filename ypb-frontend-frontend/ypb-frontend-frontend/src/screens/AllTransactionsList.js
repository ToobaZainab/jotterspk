import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Spinner from "../components/Spinner";
import { Helmet } from "react-helmet-async";
import AdminSidebar from "../components/AdminSidebar";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        withdraws: action.payload,
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

export default function AllTransactionsList() {
  const navigate = useNavigate();
  const [{ loading, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [allWithdraws, setAllWithdraws] = useState([]);
  const [userInput, setUserInput] = useState("");
  const filteredData = filterData(allWithdraws, userInput);

  function filterData(allWithdraws, userInput) {
    return allWithdraws?.filter((withdraw) => {
      return (
        withdraw?.accountName.toLowerCase().includes(userInput.toLowerCase()) ||
        withdraw?._id.toLowerCase().includes(userInput.toLowerCase())
      );
    });
  }

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${backUrl()}/api/withdraw`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setAllWithdraws(data);
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
  const deleteHandler = async (withdraw) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`${backUrl()}/api/withdraw/${withdraw._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Withdraw deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>All Transactions | Jotters Pk</title>
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
            <div className="stat_card_grid">
              <div className="stat_card table-responsive p-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Bank Name</th>
                      <th>Account Numbet</th>
                      <th>Account Name</th>
                      <th>Withdraw Amount</th>
                      <th>Paid/Unpaid</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {filteredData.map((withdraw) => (
                      <tr key={withdraw._id}>
                        <td>{withdraw._id}</td>
                        <td>{withdraw.bankName}</td>
                        <td>{withdraw.accountNumber}</td>
                        <td>{withdraw.accountName}</td>
                        <td>{withdraw.withdrawAmount}</td>
                        <td>
                          {withdraw.isPaid ? (
                            <span className="badge text-bg-success">Paid</span>
                          ) : withdraw.isCancelled ? (
                            <span className="badge text-bg-danger">
                              Cancelled
                            </span>
                          ) : (
                            <span className="badge text-bg-info">Pending</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              navigate(`/withdraw/${withdraw._id}`)
                            }
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          &nbsp;
                          <button
                            disabled={loadingDelete}
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteHandler(withdraw)}
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
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
