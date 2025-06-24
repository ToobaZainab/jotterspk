import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import Spinner from "../components/Spinner";
import { backUrl } from "../helpers/Url";

export default function ForgetPasswordScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [variant, setVariant] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await Axios.post(
        `${backUrl()}/api/users/forget-password`,
        {
          email,
        }
      );
      setMsg(data.message);
      setVariant("success");
      setEmail("");
      setLoading(false);
    } catch (err) {
      setMsg(getError(err));
      setVariant("danger");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forget Password | Jotters Pk</title>
      </Helmet>
      <div className="user_profile_wrapper container mt-3 mb-3">
        <div className="user_profile p-3">
          <Link className="btn btn-sm btn-outline-primary p-1" to="/">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h4 className="mt-2 text-center">Forget Password</h4>
          <form onSubmit={submitHandler}>
            <div className="mt-2">
              <label className="shipping_field">
                <span className="shipping_field__label" htmlFor="email">
                  Email
                </span>
                <input
                  className="shipping_field__input"
                  id="email"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            {msg && (
              <div className="mt-2 mb-2">
                <MessageBox variant={variant}>{msg}</MessageBox>
              </div>
            )}
            <div className="mt-2 mb-2">
              <button disabled={loading} className="btn btn-primary p-2 w-100">
                {loading ? <Spinner></Spinner> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
