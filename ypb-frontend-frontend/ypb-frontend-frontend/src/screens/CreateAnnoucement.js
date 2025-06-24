import React, { useContext, useReducer, useState } from "react";
import Spinner from "../components/Spinner";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

const CreateAnnoucement = () => {
  const [{ loadingCreate }, dispatch] = useReducer(reducer, {
    error: "",
  });
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(
        `${backUrl()}/api/announcement`,
        {
          title,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      navigate("/");
      toast.success("Announcement Created successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Make Announcement | Jotters Pk</title>
      </Helmet>
      <div className="user_profile_wrapper container mt-3 mb-3">
        <div className="user_profile p-3">
          <Link
            className="btn btn-sm btn-outline-primary p-1"
            to="/admin/announcementlist"
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h4 className="mt-2 text-center">Make an announcement</h4>
          <form onSubmit={submitHandler}>
            <div className="mt-2">
              <label className="shipping_field">
                <span className="shipping_field__label" htmlFor="fullname">
                  Announcement/News
                </span>
                <input
                  className="shipping_field__input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="fullname"
                />
              </label>
            </div>
            <div className="mt-2 mb-2">
              <button
                disabled={loadingCreate}
                className="btn btn-primary p-2 w-100"
              >
                {loadingCreate ? <Spinner></Spinner> : "Add annoucement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAnnoucement;
