import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Spinner from "../components/Spinner";
import AdminSidebar from "../components/AdminSidebar";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, announcements: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
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

const AnnoucementList = () => {
  const [
    { loading, error, loadingDelete, announcements, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchBanner = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`${backUrl()}/api/announcement`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchBanner();
    }
  }, [successDelete]);

  const deleteHandler = async (announcement) => {
    if (window.confirm("Are you sure to delete?")) {
      dispatch({ type: "DELETE_REQUEST" });
      try {
        await axios.delete(`${backUrl()}/api/announcement/${announcement._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Announcement deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>All Announcements | Jotters Pk</title>
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
              <Link to="/admin/create/announcement">
                <button className="btn btn-sm btn-primary" type="button">
                  New Announcement
                </button>
              </Link>
            </div>
            <div className="table-responsive p-3">
              {announcements.length === 0 ? (
                <h4 className="mt-3 text-center">No Record Found</h4>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Title</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {announcements.map((announcement) => (
                      <tr key={announcement._id}>
                        <td className="text-break">{announcement._id}</td>
                        <td>{announcement.title}</td>
                        <td>
                          <button
                            onClick={() => deleteHandler(announcement)}
                            disabled={loadingDelete}
                            type="button"
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
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AnnoucementList;
