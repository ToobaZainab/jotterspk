import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { backUrl } from './../helpers/Url';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingfetch: true };
    case "FETCH_SUCCESS":
      return { ...state, user: action.payload, loadingfetch: false };
    case "FETCH_FAIL":
      return { ...state, loadingfetch: false, error: action.payload };
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

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingfetch, loadingUpdate, error, user = {} }, dispatch] =
    useReducer(reducer, {
      loadingfetch: true,
      loadingUpdate: false,
      error: "",
    });
  const userId = userInfo._id;
  const navigate = useNavigate();
  const [name, setName] = useState(userInfo.name);
  const email = user.email;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [type, setType] = useState("password");

  const handleTogglePassword = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`${backUrl()}/api/users/mine/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== "" && password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password !== "" && password.length < 6) {
      toast.error("Password cannot be less than 6 characters");
      return;
    }
    try {
      dispatch({
        type: "UPDATE_REQUEST",
      });
      const { data } = await axios.put(
        `${backUrl()}/api/users/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({
        type: "UPDATE_FAIL",
      });
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Helmet>
        <title>User Profile | Jotters Pk</title>
      </Helmet>
      {loadingfetch ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="user_profile_wrapper container mt-3 mb-3">
          <div className="user_profile p-3">
            <Link className="btn btn-sm btn-outline-primary p-1" to="/">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
            </Link>
            <h4 className="mt-2 text-center">Update Profile</h4>
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
              <div className="mt-2 mb-2">
                <button
                  disabled={loadingUpdate}
                  className="btn btn-primary p-2 w-100"
                >
                  {loadingUpdate ? <Spinner></Spinner> : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
