import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { getError } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Spinner from "../components/Spinner";
import AdminSidebar from "../components/AdminSidebar";
import { backUrl } from "../helpers/Url";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
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

const AllReviews = () => {
  const [{ loadingDelete, loading, successDelete, error }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: false,
      loadingDelete: false,
      error: "",
    });

  const [productId, setProductId] = useState("");

  const [allReviews, setAllReviews] = useState([]);

  const productReviewsSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get(
        `${backUrl()}/api/products/reviews/${productId}`
      );
      dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      setAllReviews(result.data.reviews);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (productId === "" || productId.length !== 24) {
        return;
      }
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          `${backUrl()}/api/products/reviews/${productId}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        setAllReviews(result.data.reviews);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete, productId]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const deleteHandler = async (review) => {
    if (window.confirm("Are you sure to delete?")) {
      if (productId === "" || productId.length !== 24) {
        toast.error("Please check product Id");
        return;
      }
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(
          `${backUrl()}/api/products/reviews/${review._id}/${productId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("review deleted successfully");
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
        <title>Reviews List | Jotters Pk</title>
      </Helmet>
      <section className="admin_wrapper p-3">
        <div className="admin_sidebar bg-white p-2">
          <AdminSidebar />
        </div>
        <div className="admin_content bg-white">
          <div className="stat_card_grid mt-1 px-3"></div>
          <form
            onSubmit={productReviewsSubmitHandler}
            className="container-fluid d-flex flex-wrap align-items-center gap-2 justify-content-between mt-2"
          >
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa fa-search"></i>
              </span>
              <input
                type="search"
                className="form-control bg-light"
                placeholder="Enter Product Id"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
          </form>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : (
            <div className="table-responsive p-3">
              {allReviews.length === 0 ? (
                <h4 className="mt-3">No Record Found</h4>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Comment</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allReviews.map((review) => (
                      <tr key={review._id}>
                        <td>{review._id}</td>
                        <td>{review.name ? review.name : "Deleted User"}</td>
                        <td
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {review.comment}
                        </td>
                        <td>{review.rating}</td>
                        <td>
                          <button
                            disabled={loadingDelete}
                            onClick={() => deleteHandler(review)}
                            className="btn btn-sm btn-danger"
                          >
                            {loadingDelete ? <Spinner></Spinner> : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AllReviews;
