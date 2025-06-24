import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Spinner from "../components/Spinner";
import AdminSidebar from "../components/AdminSidebar";
import { backUrl } from "./../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
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

export default function ProductListScreen() {
  const [
    { loading, error, products, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [userInput, setUserInput] = useState("");
  const filteredData = filterData(products, userInput);

  function filterData(products, userInput) {
    return products?.filter((product) => {
      return (
        product?.name.toLowerCase().includes(userInput.toLowerCase()) ||
        product?._id.toLowerCase().includes(userInput.toLowerCase())
      );
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/products/admin?page=${page} `,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`${backUrl()}/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("product deleted successfully");
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
        <title>All Products | Jotters Pk</title>
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
            <div className="container-fluid d-flex flex-wrap align-items-center gap-2 justify-content-between mt-2">
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="addon-wrapping">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control bg-light"
                  placeholder="Type to Search"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
              <Link className="new_product_btn" to="/admin/products/create">
                <button className="btn btn-sm btn-primary" type="button">
                  Add New Product{" "}
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              </Link>
            </div>
            <div className="stat_card_grid">
              <div className="stat_card table-responsive p-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Offer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {filteredData?.map((product) => (
                      <tr key={product._id}>
                        <td
                          style={{
                            minWidth: "130px",
                            maxWidth: "150px",
                            wordBreak: "break-all",
                          }}
                        >
                          {product._id}
                        </td>
                        <td
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Link
                            className="text-dark"
                            to={`/product/${product?.slug}`}
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.offerPrice}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/product/${product._id}`)
                            }
                            className="btn btn-sm btn-success"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          &nbsp;
                          <button
                            disabled={loadingDelete}
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteHandler(product)}
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
              </div>
            </div>
            <div className="d-flex justify-content-end mb-2">
              <nav className="mx-3" aria-label="...">
                <ul className="pagination pagination-sm">
                  {[...Array(pages).keys()].map((x) => (
                    <li
                      style={{
                        boxShadow: "none",
                        outline: "none",
                      }}
                      key={x + 1}
                      className={
                        x + 1 === Number(page)
                          ? "page-item active"
                          : "page-item"
                      }
                      aria-current="page"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      <Link
                        style={{
                          boxShadow: "none",
                          outline: "none",
                        }}
                        to={`/admin/products?page=${x + 1}`}
                        className="page-link p-2"
                      >
                        {x + 1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
