import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { backUrl } from "../helpers/Url";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [type, setType] = useState("password");

  const handleTogglePassword = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo || !token) {
      navigate("/");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [navigate, userInfo, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password cannot be less than 6 characters");
      return;
    }
    try {
      await Axios.post(`${backUrl()}/api/users/reset-password`, {
        password,
        token,
      });
      navigate("/signin");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Jotters Pk</title>
      </Helmet>
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
                  New Password
                </span>
                <input
                  className="shipping_field__input"
                  id="fullname"
                  type={type}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="mt-2">
              <label className="shipping_field">
                <span className="shipping_field__label" htmlFor="email">
                  Confirm Password
                </span>
                <input
                  className="shipping_field__input"
                  id="email"
                  type={type}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
              <label className="form-check-label" for="defaultCheck1">
                Show Passowrd
              </label>
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
