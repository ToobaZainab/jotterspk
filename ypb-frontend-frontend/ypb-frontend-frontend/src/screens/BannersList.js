import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Spinner from "./../components/Spinner";
import AdminSidebar from "./../components/AdminSidebar";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST_BANNER":
      return { ...state, loading: true };
    case "FETCH_SUCCESS_BANNER":
      return { ...state, homes: action.payload, loading: false };
    case "FETCH_FAIL_BANNER":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        loadingUpdate: false,
      };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const BannersList = () => {
  const [
    { loading, error, loadingDelete, successDelete, loadingUpdate },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    const fetchBanner = async () => {
      dispatch({ type: "FETCH_REQUEST_BANNER" });
      try {
        const result = await axios.get(`${backUrl()}/api/banners`);
        dispatch({ type: "FETCH_SUCCESS_BANNER", payload: result.data });
        setBanners(result.data);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL_BANNER", payload: err.message });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchBanner();
    }
  }, [successDelete]);

  const deleteHandler = async (banner) => {
    if (window.confirm("Are you sure to delete?")) {
      dispatch({ type: "DELETE_REQUEST" });
      try {
        await axios.delete(`${backUrl()}/api/banners/${banner._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Banner deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const [dragBtn, setDragBtn] = useState(false);
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    setDragBtn(true);
    const sourceIndex = e.dataTransfer.getData("index");
    const updatedBanners = [...banners];
    const [draggedImage] = updatedBanners.splice(sourceIndex, 1);
    updatedBanners.splice(targetIndex, 0, draggedImage);
    setBanners(updatedBanners);
  };
  const newbanners = banners;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${backUrl()}/api/banners/order`,
        { newbanners },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      navigate("/admin/bannerslist");
      toast.success("Banner rearranged successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>All Banners | Jotters Pk</title>
      </Helmet>
      <section className="admin_wrapper p-3">
        <div className="admin_sidebar bg-white p-2">
          <AdminSidebar />
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="admin_content bg-white">
            <div className="container-fluid d-flex flex-wrap align-items-center justify-content-end mt-2">
              <Link to="/admin/create/banner">
                <button className="btn btn-sm btn-primary" type="button">
                  Add New Banner <i className="bi bi-plus"></i>
                </button>
              </Link>
            </div>
            <div className="table-responsive p-3">
              {banners.length === 0 ? (
                <h4 className="mt-3 text-center">No Record Found</h4>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Link</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {banners.map((banner, index) => (
                      <tr
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        key={banner._id}
                      >
                        <td>{banner._id}</td>
                        <td>{banner.name}</td>
                        <td
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {banner.description}
                        </td>
                        <td>{banner.link}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/banner/${banner._id}`)
                            }
                            className="btn btn-sm btn-success"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          &nbsp;
                          <button
                            onClick={() => deleteHandler(banner)}
                            type="button"
                            disabled={loadingDelete}
                            className="btn btn-sm btn-danger"
                          >
                            {loadingDelete ? (
                              <Spinner></Spinner>
                            ) : (
                              <i className="bi bi-trash3-fill"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                disabled={loadingUpdate}
                className={dragBtn ? "btn btn-sm btn-primary" : "d-none"}
                onClick={submitHandler}
              >
                {loadingUpdate ? "Loading..." : "Rearrange"}
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default BannersList;
