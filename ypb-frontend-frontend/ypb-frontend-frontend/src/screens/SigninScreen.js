import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { getError } from "../utils";
import Spinner from "../components/Spinner";
import MessageBox from "../components/MessageBox";
import { backUrl } from "../helpers/Url";

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [type, setType] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [variant, setVariant] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await Axios.post(`${backUrl()}/api/users/signin`, {
        email,
        password,
      });
      setLoading(false);
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
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
        <title>Sign In | Jotters Pk</title>
      </Helmet>
      <div className="mt-3 mb-3 p-2">
        <div className="login_wrapper container p-3">
          <div className="login_form_wrapper mb-3">
            <div className="login_form">
              <h3 className="text-center mb-3 fw-bold">
                Login to your account
              </h3>
              <form onSubmit={submitHandler}>
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
                <div className="form-floating mb-1">
                  <input
                    type={type}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-check mb-3">
                  <input
                    onClick={handleTogglePassword}
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
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
                    {loading ? <Spinner></Spinner> : "Sign In"}
                  </button>
                </div>
              </form>
              {msg && (
                <div className="mt-1 mb-1">
                  <MessageBox variant={variant}>{msg}</MessageBox>
                </div>
              )}
              <div className="mt-3 d-flex justify-content-between flex-wrap">
                <Link className="text-dark" to="/forget-password">
                  Forgot Passowrd?{" "}
                  <span className="text-decoration-underline">Reset Now</span>
                </Link>
                <Link className="text-dark" to={`/signup?redirect=${redirect}`}>
                  Don't have an account?{" "}
                  <span className="text-decoration-underline">Sign up!</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
