import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      return { ...state, withdraws: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function TransactionHistory() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const userId = userInfo._id;

  const [transaction, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`${backUrl()}/api/withdraw/mine/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setTransactions(data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [userInfo]);

  return (
    <div>
      <h2 className="mx-3 mt-2">Transaction History</h2>
      <Helmet>
        <title>My Transactions | Jotters Pk</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="table-responsive p-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Bank Name</th>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Withdraw Amount</th>
                <th>Paid/Unpaid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {transaction.map((withdraw) => (
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
                      <span className="badge text-bg-danger">Cancelled</span>
                    ) : (
                      <span className="badge text-bg-info">Pending</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => navigate(`/withdraw/${withdraw._id}`)}
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
