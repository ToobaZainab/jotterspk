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
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};

const CreateBanner = () => {
  const [{ loadingCreate, loadingUpload }, dispatch] = useReducer(reducer, {
    error: "",
  });
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(
        `${backUrl()}/api/banners`,
        {
          name,
          image,
          link,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      navigate("/");
      toast.success("Banner Created successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (file.length === 0) {
      return;
    }
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        `${backUrl()}/api/upload`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      setImage(data.secure_url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Poster | Jotters Pk</title>
      </Helmet>
      <div className="user_profile_wrapper container mt-3 mb-3">
        <div className="user_profile p-3">
          <Link
            to="/admin/bannerslist"
            className="btn btn-sm btn-outline-primary p-1"
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h4 className="mt-2 text-center">Add Poster</h4>
          <form onSubmit={submitHandler}>
            <div className="mt-2">
              <label className="shipping_field">
                <span className="shipping_field__label" htmlFor="fullname">
                  Poster Title
                </span>
                <input
                  className="shipping_field__input"
                  value={name}
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                  id="fullname"
                />
              </label>
            </div>
            <div className="mt-2">
              <label className="shipping_field">
                <span className="shipping_field__label" htmlFor="email">
                  Poster link (product slug)
                </span>
                <input
                  className="shipping_field__input"
                  id="email"
                  type="text"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </label>
            </div>
            <div className="mt-2">
              <label className="shipping_field">
                <span className="shipping_field__label" htmlFor="email">
                  Poster Description
                </span>
                <textarea
                  className="shipping_field__input"
                  id="email"
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
            <div className="row mt-2">
              <div className="input-group">
                <label className="input-group-text" for="inputGroupFile01">
                  Poster Image
                </label>
                <input
                  disabled={loadingUpload && loadingCreate}
                  onChange={uploadFileHandler}
                  accept="image/*"
                  type="file"
                  className="form-control"
                  id="inputGroupFile01"
                />
              </div>
              <p className="text-center">OR</p>
              <div className="mt-2">
                <label className="shipping_field">
                  <span className="shipping_field__label" htmlFor="email">
                    Paste Url(if u don't have in gallery)
                  </span>
                  <input
                    className="shipping_field__input"
                    id="email"
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="mt-2 mb-2">
              <button
                type="submit"
                disabled={loadingCreate}
                className="btn btn-primary p-2 w-100"
              >
                {loadingCreate ? <Spinner></Spinner> : "ADD BANNER"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateBanner;
