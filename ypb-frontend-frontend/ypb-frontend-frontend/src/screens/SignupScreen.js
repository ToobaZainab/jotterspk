import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import MessageBox from "../components/MessageBox";
import Spinner from "../components/Spinner";
import { getError } from "../utils";
import { backUrl } from './../helpers/Url';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [variant, setVariant] = useState("");
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState("password");

  const handleTogglePassword = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const { state } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setVariant("danger");
      setMsg("Passowrds do not match.");
      return;
    }
    if (password.length < 6) {
      setVariant("danger");
      setMsg("Password cannot be less than 6 characters.");
      return;
    }
    try {
      setLoading(true);
      await Axios.post(`${backUrl()}/api/users/signup`, {
        name,
        email,
        password,
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setVariant("success");
      setMsg(
        `An email was sent to ${email}, please check your mail to verify it. If you don't find the mail in your inbox, please check in the spam folder.`
      );
      setLoading(false);
    } catch (err) {
      setVariant("danger");
      setMsg(getError(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div>
      <Helmet>
        <title>Sign Up | Jotters Pk</title>
      </Helmet>
      <div className="mt-3 mb-3 p-2">
        <div className="login_wrapper container p-3">
          <div className="mt-5 mb-5"></div>
          <div className="login_form_wrapper">
            <div className="login_form mb-2">
              <h3 className="text-center mt-3 mb-3 fw-bold">
                Create a new account
              </h3>
              <form onSubmit={submitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                    id="floatingInputName"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingInputName">Username</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type={type}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    type={type}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control"
                    id="floatingPasswordConfirm"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPasswordConfirm">
                    Confirm Password
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onClick={handleTogglePassword}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Show Password
                  </label>
                </div>
                <div className="submit_btn">
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    {loading ? <Spinner></Spinner> : "Register"}
                  </button>
                </div>
              </form>
              {msg && (
                <div className="mt-1 mb-1">
                  <MessageBox variant={variant}>{msg}</MessageBox>
                </div>
              )}
              <div className="mt-3 d-flex justify-content-end">
                <Link className="text-dark" to={`/signin?redirect=${redirect}`}>
                  Already have an account?{" "}
                  <span className="text-decoration-underline">Login Now!</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
