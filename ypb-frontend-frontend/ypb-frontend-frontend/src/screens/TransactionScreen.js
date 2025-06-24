import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { backUrl } from "../helpers/Url";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, withdraw: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CANCEL_REQUEST":
      return { ...state, loadingCancelled: true };
    case "CANCEL_SUCCESS":
      return { ...state, loadingCancelled: false, successCancelled: true };
    case "CANCEL_FAIL":
      return { ...state, loadingCancelled: false };
    case "CANCEL_RESET":
      return {
        ...state,
        loadingCancelled: false,
        successCancelled: false,
      };
    case "PAID_REQUEST":
      return { ...state, loadingPay: true };
    case "PAID_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAID_FAIL":
      return { ...state, loadingPay: false };
    case "PAID_RESET":
      return {
        ...state,
        loadingPay: false,
        successPay: false,
      };
    default:
      return state;
  }
}

export default function TransactionScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: transactionId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      withdraw,
      loadingPay,
      loadingCancelled,
      successCancelled,
      successPay,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    withdraw: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  useEffect(() => {
    const fetchwithdraw = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${backUrl()}/api/withdraw/${transactionId}`, {
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
    if (
      !withdraw._id ||
      successPay ||
      successCancelled ||
      (withdraw._id && withdraw._id !== transactionId)
    ) {
      fetchwithdraw();
      if (successPay) {
        dispatch({ type: "DELIVER_RESET" });
      }
      if (successCancelled) {
        dispatch({ type: "CANCEL_RESET" });
      }
    }
  }, [
    withdraw,
    userInfo,
    transactionId,
    navigate,
    successCancelled,
    successPay,
  ]);

  async function paidWithdrawHandler() {
    try {
      dispatch({ type: "PAID_REQUEST" });
      const { data } = await axios.put(
        `${backUrl()}/api/withdraw/${transactionId}/pay`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "PAID_SUCCESS", payload: data });
      toast.success("withdraw is delivered");
      navigate("/admin/allwithdraws");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "PAID_FAIL" });
    }
  }

  let datePaid = new Date(withdraw.paidAt);
  let dateCreated = new Date(withdraw.createdAt).toString();

  async function cancelwithdrawHandler() {
    try {
      dispatch({ type: "CANCEL_REQUEST" });
      const { data } = await axios.put(
        `${backUrl()}/api/withdraw/${transactionId}/cancel`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CANCEL_SUCCESS", payload: data });
      toast.success("withdraw Cancelled");
      navigate("/admin/allwithdraws");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CANCEL_FAIL" });
    }
  }
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      <Helmet>
        <title>Transaction Details | Jotters Pk</title>
      </Helmet>
      <div className="user_profile_wrapper container mt-3 mb-3">
        <div className="user_profile p-3">
          <Link
            className="btn btn-sm btn-outline-primary p-1"
            to={
              userInfo.isAdmin
                ? "/admin/allwithdraws"
                : "/reseller/mytransactions"
            }
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h4 className="mt-2 text-center">Withdraw Details</h4>
          <div className="mt-2">
            {withdraw.isPaid ? (
              <MessageBox variant="success">
                Paid at {datePaid.toString()}
              </MessageBox>
            ) : withdraw.isCancelled ? (
              <MessageBox variant="danger">
                withdraw Has been Cancelled
              </MessageBox>
            ) : (
              <MessageBox variant="info">
                Pending Since {dateCreated}
              </MessageBox>
            )}
          </div>
          <div className="mt-2">
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="fullname">
                Bank Name
              </span>
              <input
                className="shipping_field__input"
                value={withdraw.bankName}
                id="fullname"
              />
            </label>
          </div>
          <div className="mt-2">
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="email">
                Account Number
              </span>
              <input
                className="shipping_field__input"
                id="email"
                value={withdraw.accountNumber}
              />
            </label>
          </div>
          <div className="mt-2">
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="password2">
                Account Holder Name
              </span>
              <input
                className="shipping_field__input"
                value={withdraw.accountName}
                id="password2"
              />
            </label>
          </div>
          <div className="mt-2">
            <label className="shipping_field">
              <span className="shipping_field__label" htmlFor="password">
                Withdrawal Amount
              </span>
              <input
                className="shipping_field__input"
                value={withdraw.withdrawAmount}
                id="password"
              />
            </label>
          </div>
          {userInfo.isAdmin && (
            <div className="mt-2">
              <Link to={`/admin/user/${withdraw.user}`}>
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="password">
                    View User Details
                  </span>
                  <input
                    className="shipping_field__input"
                    value={withdraw.user}
                    id="password"
                  />
                </label>
              </Link>
            </div>
          )}
          {userInfo.isAdmin && !withdraw.isPaid && !withdraw.isCancelled && (
            <div className="mt-2 mb-2 d-flex justify-content-between flex-wrap align-items-center">
              <button
                onClick={paidWithdrawHandler}
                className="btn btn-sm btn-success"
                type="button"
              >
                {loadingPay ? <Spinner></Spinner> : "Paid Successfully"}
              </button>
              <button
                onClick={cancelwithdrawHandler}
                className="btn btn-sm btn-danger"
                type="button"
              >
                {loadingCancelled ? <Spinner></Spinner> : "Cancel Withdraw"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
