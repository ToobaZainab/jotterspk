import React, { useEffect, useReducer, useState } from "react";
import { ArrowRight, Component } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import NewsLetter from "../components/NewsLetter";
import BottomFooter from "../components/BottomFooter";
import axios from "axios";
import { getError } from "../utils";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";
import Rating from "../components/Rating";
import InfoBoxes from "../components/InfoBoxes";
import ReactPaginate from "react-paginate";
import { backUrl } from "../helpers/Url";

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
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "Rs1 to Rs300",
    value: "1-300",
  },
  {
    name: "Rs301 to Rs500",
    value: "301-500",
  },
  {
    name: "Rs501 to Rs1000",
    value: "501-1000",
  },
  {
    name: "Rs1001 to Rs2000",
    value: "1001-2000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

const SearchScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  let items = [...Array(pages).keys()].map((x) => x + 1);
  const pageCount = Math.ceil(items.length);

  const [thisPage, setThisPage] = useState(page);
  const handlePageClick = (event) => {
    navigate(`/search?page=${event.selected + 1}`);
    setThisPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const navigateHandler = () => {
  //   navigate("/search");
  // };

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Helmet>
            <title>Search | Jotters Pk</title>
          </Helmet>
          <div className="d-md-none mobile_filters_wrapper mt-2 mb-2">
            <p className="px-2">Choose Categories :</p>
            <div className="mobile_categories_wrapper">
              <ul>
                <Link
                  className={
                    category === "all"
                      ? "btn btn-info"
                      : "btn btn-outline-info text-dark"
                  }
                  to={getFilterUrl({ category: "all", page: 1 })}
                >
                  <li>All</li>
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c}
                    className={
                      category === c
                        ? "btn btn-info"
                        : "btn btn-outline-info text-dark"
                    }
                    to={getFilterUrl({ category: c, page: 1 })}
                  >
                    <li>{c}</li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-2 custom_select_wrapper">
            <details className="custom-select">
              <summary className="radios_select">
                <input
                  className="input_select_radio"
                  type="radio"
                  name="item"
                  id="item1"
                  title="Newest Arrivals"
                  defaultChecked
                  value="newest"
                  onClick={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                />
                <input
                  className="input_select_radio"
                  type="radio"
                  name="item"
                  id="item2"
                  title="Price: Low to High"
                  value="lowest"
                  onClick={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                />
                <input
                  className="input_select_radio"
                  type="radio"
                  name="item"
                  id="item3"
                  title="Price: High to Low"
                  value="highest"
                  onClick={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                />
                <input
                  className="input_select_radio"
                  type="radio"
                  name="item"
                  id="item4"
                  title="Avg. Customer Reviews"
                  value="toprated"
                  onClick={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                />
              </summary>
              <ul className="list">
                <li>
                  <label htmlFor="item1">Newest Arrivals</label>
                </li>
                <li>
                  <label htmlFor="item2">Price: Low to High</label>
                </li>
                <li>
                  <label htmlFor="item3">Price: High to Low</label>
                </li>
                <li>
                  <label htmlFor="item4">Avg. Customer Reviews</label>
                </li>
              </ul>
            </details>
          </div>
          <div className="shop_wrapper mt-1">
            <div className="filters_wrapper">
              <div className="shop_filter bg-white p-3">
                <h5 className="fw-bold mb-2">
                  <Component size={20} strokeWidth={2} /> Filter By Category
                </h5>
                <ul>
                  <li>
                    <Link
                      className="text-dark"
                      to={getFilterUrl({ category: "all", page: 1 })}
                    >
                      <ArrowRight size={15} strokeWidth={0.5} />
                      Any
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        className="text-dark"
                        to={getFilterUrl({ category: c, page: 1 })}
                      >
                        <i className="bi bi-arrow-right-short"></i> {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shop_filter mt-2 bg-white p-3">
                <h5 className="fw-bold mb-2">
                  <Component size={20} strokeWidth={2} /> Filter By Price
                </h5>
                <ul>
                  <li>
                    <Link
                      className={
                        "all" === price ? "text-bold text-dark" : "text-dark"
                      }
                      to={getFilterUrl({ price: "all", page: 1 })}
                    >
                      Any
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link
                        to={getFilterUrl({ price: p.value, page: 1 })}
                        className={
                          p.value === price
                            ? "text-bold text-dark"
                            : "text-dark"
                        }
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shop_filter mt-2 bg-white p-3">
                <h5 className="fw-bold mb-2">
                  <Component size={20} strokeWidth={2} /> Filter By Reviews
                </h5>
                <ul>
                  {ratings.map((r) => (
                    <li key={r.rating}>
                      <Link
                        to={getFilterUrl({ rating: r.rating, page: 1 })}
                        className={
                          `${r.rating}` === `${rating}`
                            ? "text-bold text-dark"
                            : "text-dark"
                        }
                      >
                        <Rating caption={" & up"} rating={r.rating}></Rating>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={getFilterUrl({ rating: "all" })}
                      className={
                        rating === "all" ? "text-bold text-dark" : "text-dark"
                      }
                    >
                      <Rating caption={" & up"} rating={0}></Rating>
                    </Link>
                  </li>
                </ul>
              </div>
              {query !== "all" ||
              category !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <div className="shop_filter text-center mt-2 bg-white p-3">
                  <button
                    className="btn btn-sm w-100 btn-danger"
                    onClick={() => navigate("/search")}
                  >
                    Remove Filters
                  </button>
                </div>
              ) : null}
            </div>
            <div className="shop_products_wrapper ">
              <div className="product_card_grid">
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
              </div>
              <div className="product_card_grid">
                {products.map((product) => (
                  <ProductCard product={product} key={product._id} />
                ))}
              </div>
              <div className="pagination_results_wrapper mt-2 ">
                <div className="shop_results bg-light p-2">
                  <p>
                    Total Results {countProducts === 0 ? "0" : countProducts}
                  </p>
                </div>
                <div className="mt-1">
                  <ReactPaginate
                    className="shop_pagination"
                    breakLinkClassName="btn btn-sm btn-light p-2 rounded-0"
                    pageLinkClassName="btn btn-sm btn-light p-2 rounded-0"
                    activeLinkClassName={
                      Number(page) === thisPage ? "activePage" : ""
                    }
                    breakLabel="..."
                    nextLabel={false}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={3}
                    pageCount={pageCount}
                    previousLabel={false}
                    renderOnZeroPageCount={null}
                  />
                </div>
              </div>
            </div>
          </div>
          <InfoBoxes />
          <NewsLetter />
          <Footer />
          <BottomFooter />
        </div>
      )}
    </>
  );
};

export default SearchScreen;
