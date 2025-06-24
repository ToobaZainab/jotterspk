import React, { useContext, useEffect, useReducer, useState } from "react";
import Spinner from "../components/Spinner";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { backUrl } from "../helpers/Url";
import LoadingBox from "../components/LoadingBox";

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
      return {
        ...state,
        loadingCreate: false,
      };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
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

const BannerEdit = () => {
  const navigate = useNavigate();
  const params = useParams(); // /banner/:id
  const { id: bannerId } = params;

  const [{ loadingUpdate, loading, loadingUpload }, dispatch] = useReducer(
    reducer,
    {
      error: "",
      loading: true,
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${backUrl()}/api/banners/${bannerId}`
        );
        setName(data.name);
        setImage(data.image);
        setLink(data.link);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [bannerId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${backUrl()}/api/banners/${bannerId}`,
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
        type: "UPDATE_SUCCESS",
      });
      navigate("/");
      toast.success("Banner Created successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
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
        <title>Edit Poster | Jotters Pk</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : (
        <div className="user_profile_wrapper container mt-3 mb-3">
          <div className="user_profile p-3">
            <Link
              to="/admin/bannerslist"
              className="btn btn-sm btn-outline-primary p-1"
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
            </Link>
            <h4 className="mt-2 text-center">Edit/Update Poster</h4>
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
                    disabled={loadingUpload || loadingUpdate}
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
                  disabled={loadingUpdate}
                  className="btn btn-primary p-2 w-100"
                >
                  {loadingUpdate ? <Spinner></Spinner> : "Update Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BannerEdit;
