import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Spinner from "../components/Spinner";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEditScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [processingTransaction, setProcessingTransaction] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [isReseller, setIsReseller] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${backUrl()}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setTotalBalance(data.totalBalance);
        setProcessingTransaction(data.processingTransaction);
        setTotalWithdraw(data.totalWithdraw);
        setIsAdmin(data.isAdmin);
        setIsReseller(data.isReseller);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const [type, setType] = useState("password");

  const handleTogglePassword = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${backUrl()}/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          password,
          isAdmin,
          isReseller,
          totalBalance,
          processingTransaction,
          totalWithdraw,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("User updated successfully");
      navigate("/admin/users");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <>
      <Helmet>
        <title>Edit User ${userId} | Jotters Pk</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="user_profile_wrapper container mt-3 mb-3">
          <div className="user_profile p-3">
            <Link
              to="/admin/users"
              className="btn btn-sm btn-outline-primary p-1"
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
            </Link>
            <h4 className="mt-2 text-center">Update User</h4>
            <form onSubmit={submitHandler}>
              <div className="mt-2">
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="fullname">
                    Full Name
                  </span>
                  <input
                    className="shipping_field__input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    id="fullname"
                  />
                </label>
              </div>
              <div className="mt-2">
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="email">
                    Email
                  </span>
                  <input
                    className="shipping_field__input"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mt-2">
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="password">
                    Password
                  </span>
                  <input
                    className="shipping_field__input"
                    type={type}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                  />
                </label>
              </div>
              <div className="mt-2">
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="password2">
                    Confirm Password
                  </span>
                  <input
                    className="shipping_field__input"
                    type={type}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="password2"
                  />
                </label>
              </div>
              <div className="mt-2">
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="tbalance">
                    Total Balance
                  </span>
                  <input
                    className="shipping_field__input"
                    value={totalBalance}
                    onChange={(e) => setTotalBalance(e.target.value)}
                    id="tbalance"
                  />
                </label>
              </div>
              <div className="mt-2">
                <label className="shipping_field">
                  <span
                    className="shipping_field__label"
                    htmlFor="processtrans"
                  >
                    Processing Transaction
                  </span>
                  <input
                    className="shipping_field__input"
                    value={processingTransaction}
                    onChange={(e) => setProcessingTransaction(e.target.value)}
                    id="processtrans"
                  />
                </label>
              </div>
              <div className="mt-2">
                <label className="shipping_field">
                  <span
                    className="shipping_field__label"
                    htmlFor="processtrans"
                  >
                    Total Withdraw
                  </span>
                  <input
                    className="shipping_field__input"
                    value={totalWithdraw}
                    onChange={(e) => setTotalWithdraw(e.target.value)}
                    id="processtrans"
                  />
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="defaultCheck1"
                  onClick={handleTogglePassword}
                />
                <label className="form-check-label" htmlFor="defaultCheck1">
                  Show Passowrd
                </label>
              </div>
              <div className="mt-1 mb-2">
                <h5 className="text-center fw-bold">Change Role of User</h5>
                <div className="form-check">
                  <input
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="form-check-input"
                    type="checkbox"
                    id="AdminCheck"
                  />
                  <label className="form-check-label" htmlFor="AdminCheck">
                    Admin
                  </label>
                </div>
                <div className="form-check">
                  <input
                    checked={isReseller}
                    onChange={(e) => setIsReseller(e.target.checked)}
                    className="form-check-input"
                    type="checkbox"
                    id="ResellerCheck"
                  />
                  <label className="form-check-label" htmlFor="ResellerCheck">
                    Reseller
                  </label>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <button
                  disabled={loadingUpdate}
                  className="btn btn-primary p-2 w-100"
                >
                  {loadingUpdate ? <Spinner></Spinner> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
