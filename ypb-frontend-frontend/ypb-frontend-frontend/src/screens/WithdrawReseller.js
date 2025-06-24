import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Banknote, CircleDashed, Wallet } from "lucide-react";
import Spinner from "../components/Spinner";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingfetch: true };
    case "FETCH_SUCCESS":
      return { ...state, user: action.payload, loadingfetch: false };
    case "FETCH_FAIL":
      return { ...state, loadingfetch: false, error: action.payload };
    case "CREATE_WITHDRAW_REQUEST":
      return { ...state, loading: true };
    case "CREATE_WITHDRAW_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_WITHDRAW_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
const WithdrawReseller = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loadingfetch, loading, error, user = {} }, dispatch] = useReducer(
    reducer,
    {
      loadingfetch: true,
      loading: false,
      error: "",
    }
  );

  const userId = userInfo._id;
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/users/profile/withdraw/${userId}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo, userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (withdrawAmount < 1) {
      toast.error("Enter a valid amount");
      return;
    }
    if (withdrawAmount > user.totalBalance) {
      toast.error("Not enough Balance");
      return;
    }
    if (user.processingTransaction > 0) {
      toast.error("You already have a pending transaction");
      return;
    }
    try {
      dispatch({ type: "CREATE_WITHDRAW_REQUEST" });
      await axios.post(
        `${backUrl()}/api/withdraw`,
        {
          bankName: bankName,
          accountNumber: accountNumber,
          accountName: accountName,
          withdrawAmount: withdrawAmount,
          user: userId,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "CREATE_WITHDRAW_SUCCESS" });
      navigate("/reseller/mytransactions");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_WITHDRAW_FAIL" });
    }
  };
  return (
    <>
      <Helmet>
        <title>Withdraw Amount | Jotters Pk</title>
      </Helmet>
      {loadingfetch ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="container">
          <div className="stat_card_grid mt-3">
            <div className="stat_card bg-white p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stat_card_icon">
                  <Wallet size={36} color="#ffffff" />
                </div>
                <div className="stat_card_text">
                  <p>Available Balance</p>
                  <h4>{user.totalBalance}</h4>
                  <p>
                    <i class="fa fa-info-circle" aria-hidden="true"></i> 10%
                    amount will be deducted on every withdraw.
                  </p>
                </div>
              </div>
            </div>
            <div className="stat_card bg-white p-3">
              <div className="d-flex  align-items-center gap-3">
                <div className="stat_card_icon">
                  <CircleDashed size={36} color="#ffffff" />
                </div>
                <div className="stat_card_text">
                  <p>Pending Withdraw</p>
                  <h4>{user.processingTransaction}</h4>
                  <p>
                    <i class="fa fa-info-circle" aria-hidden="true"></i> If you
                    already have a pending transaction, you can not make new
                    one.
                  </p>
                </div>
              </div>
            </div>
            <div className="stat_card bg-white p-3">
              <div className="d-flex  align-items-center gap-3">
                <div className="stat_card_icon">
                  <Banknote size={36} color="#ffffff" />
                </div>
                <div className="stat_card_text">
                  <p>Total Withdraw</p>
                  <h4>{user.totalWithdraw}</h4>
                  <p>
                    <i class="fa fa-info-circle" aria-hidden="true"></i> Total
                    amount you have withdrawn till date.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="user_profile_wrapper container mt-3 mb-3">
            <div className="user_profile p-3">
              <Link to="/reseller/dashboard">
                <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
              </Link>
              <h4 className="mt-2 text-center">Withdraw Balance</h4>
              <form onSubmit={submitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    required
                    onChange={(e) => setBankName(e.target.value)}
                    className="form-control"
                    id="floatingInputName"
                  />
                  <label htmlFor="floatingInputName">Bank Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    required
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="form-control"
                    id="floatingInput"
                  />
                  <label htmlFor="floatingInput">Account Number/IBAN</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    required
                    onChange={(e) => setAccountName(e.target.value)}
                    className="form-control"
                    id="floatingPassword"
                  />
                  <label htmlFor="floatingPassword">Account Holder Name</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    type="Number"
                    required
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="form-control"
                    id="floatingPasswordConfirm"
                  />
                  <label htmlFor="floatingPasswordConfirm">
                    Withdrawal Amount
                  </label>
                </div>
                <div className="submit_btn">
                  <button
                    disabled={
                      loading &
                      (withdrawAmount < 1) &
                      (withdrawAmount > user.totalBalance)
                    }
                    type="submit"
                    className={
                      withdrawAmount < 1 || withdrawAmount > user.totalBalance
                        ? "btn btn-primary disabled w-100"
                        : "btn btn-primary w-100"
                    }
                  >
                    {loading ? <Spinner></Spinner> : "Withdraw"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawReseller;
