import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import ProductCard from "./../components/ProductCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { MinusCircle, Component, PlusCircle } from "lucide-react";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import BottomFooter from "../components/BottomFooter";
import { backUrl } from "../helpers/Url";
import Spinner from "../components/Spinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadReview, setLoadReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          `${backUrl()}/api/products/slug/${slug}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        setSelectedImage(result.data.image);
        if (result.data.colors.length > 0) {
          setSelectedColor(result.data.colors[0]);
        }
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [qty, setQty] = useState(1);
  const increaseQuantity = () => {
    if (product.countInStock <= qty) {
      return toast.error("Sorry. Product stock is limited");
    } else {
      const itemquantity = qty + 1;
      setQty(itemquantity);
    }
  };

  const decreaseQuantity = () => {
    if (1 >= qty) return;
    const itemquantity = qty - 1;
    setQty(itemquantity);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const colors = selectedColor;
    if (product.colors?.length > 1 && !colors) {
      toast.error("Please choose a color");
      return;
    }
    const quantity = existItem ? existItem.quantity + qty : qty;
    const { data } = await axios.get(
      `${backUrl()}/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity, colors },
    });
    toast.success("Item added to cart");
  };

  const buyNowHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    const colors = selectedColor;
    if (product.colors?.length > 1 && !colors) {
      toast.error("Please choose a color");
      return;
    }
    const { data } = await axios.get(
      `${backUrl()}/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity, colors },
    });
    navigate("/cart");
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadReview(true);
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      setLoadReview(false);
      return;
    }
    try {
      setLoadReview(true);
      const { data } = await axios.post(
        `${backUrl()}/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      setLoadReview(false);
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
    } catch (error) {
      toast.error(getError(error));
      setLoadReview(false);
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const [products, setProducts] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch(`${backUrl()}/api/products`)
      .then((res) => res.json())
      .then((products) => setProducts(products))
      .catch((err) => toast.error(err));
  };

  const relatedProducts = products.filter(
    (item) => item.category === product.category && item._id !== product._id
  );

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Helmet>
            <title>{product.name} | Jotters Pk</title>
          </Helmet>
          <div className="product_details_main_wrapper px-1">
            <div className="product_details_wrapper mt-3 mb-3">
              <div className="product_details container bg-white">
                <div className="row">
                  <div className="col-12 col-md-6 product_images p-2">
                    <div className="product_img_wrapper h-100">
                      <div className="product_lg_img mb-2">
                        <img
                          loading="lazy"
                          src={selectedImage || product.image}
                          alt=""
                        />
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={selectedImage}
                          className="btn btn-sm btn-secondary p-1"
                          download={selectedImage}
                        >
                          Download{" "}
                          <i className="fa fa-download" aria-hidden="true"></i>
                        </a>
                      </div>
                      <div className="product_sm_img">
                        {[product.image, ...product.images].map((x) => (
                          <img
                            loading="lazy"
                            onClick={() => setSelectedImage(x)}
                            key={x}
                            src={x}
                            className={selectedImage === x ? "active" : ""}
                            alt=""
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 product_text_wrapper p-2 ">
                    <div className="product_text h-100">
                      <div className="product_cat_name_reviews p-2">
                        <span>Categroy : {product.category}</span>
                        <h4>{product.name}</h4>
                        <p className="mt-2">
                          <Rating
                            rating={product.rating}
                            numReviews={product.numReviews}
                          ></Rating>
                        </p>
                        {product.countInStock > 0 ? (
                          <p className="mt-2 p-1 px-2 fw-light badge text-bg-success">
                            InStock
                          </p>
                        ) : (
                          <p className="mt-2 p-1 px-2 fw-light badge text-bg-danger">
                            OutOfStock
                          </p>
                        )}
                        {product.countInStock <= 5 && (
                          <p className="text-danger">
                            Low Stock: {product.countInStock} Left
                          </p>
                        )}
                      </div>
                      <div className="product_qty_cart p-2">
                        <h3>Rs {product.price}</h3>
                        {product.offerPrice > 0 && (
                          <h6>Rs {product.offerPrice}</h6>
                        )}
                        <h5
                          className={
                            product.colors?.length === 0
                              ? "d-none"
                              : "fw-lighter fs-6"
                          }
                        >
                          Choose Color :
                        </h5>
                        <div
                          className={
                            product.colors?.length === 0
                              ? "d-none"
                              : "d-flex flex-wrap align-items-center"
                          }
                        >
                          {product.colors?.map((color) => (
                            <button
                              onClick={(e) => handleColorChange(e.target.value)}
                              className={
                                selectedColor === color
                                  ? "text-capitalize btn btn-sm btn-primary m-1"
                                  : "text-capitalize btn btn-sm btn-outline-primary m-1"
                              }
                              key={color}
                              value={color}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                        {product.countInStock > 0 && (
                          <div className="product_qty p-2 px-0 mt-2">
                            <button
                              onClick={decreaseQuantity}
                              className="btn_qty_dec"
                            >
                              <MinusCircle size={20} strokeWidth={2} />
                            </button>
                            <input type="text" value={qty} readOnly />
                            <button
                              onClick={increaseQuantity}
                              className="btn_qty_inc"
                            >
                              <PlusCircle size={20} strokeWidth={2} />
                            </button>{" "}
                            &nbsp;
                            <button
                              onClick={buyNowHandler}
                              className="btn btn-primary w-50 mt-1 mt-sm-0"
                            >
                              Buy Now
                            </button>
                          </div>
                        )}
                        <div className="mt-2">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://api.whatsapp.com/send?phone=923146134122"
                          >
                            <button className="btn btn-sm btn-success">
                              Order on Whatsapp{" "}
                              <img
                                width="20"
                                height="20"
                                src="https://img.icons8.com/color/48/whatsapp--v1.png"
                                alt="whatsapp--v1"
                              />
                            </button>
                          </a>
                          &nbsp;
                          {product.countInStock > 0 && (
                            <button
                              onClick={addToCartHandler}
                              className="btn btn-sm btn-outline-primary "
                            >
                              Add to cart
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="product_price_highlights p-2">
                        <p>
                          <h5>Highlights</h5>
                          <p
                            className="mx-3"
                            dangerouslySetInnerHTML={{
                              __html: product.highlights,
                            }}
                          ></p>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="submit_review_wrapper container bg-white mt-2 mb-2">
              <div className="row">
                <div className="bg-light col-12 col-sm-4 p-3 d-flex justify-content-center align-items-center">
                  <div className="text-center">
                    <p>
                      <span className="fs-2">{product.rating.toFixed(1)}</span>
                      <span>/5</span>
                    </p>
                    <p>
                      <Rating rating={product.rating}></Rating>
                      {product.numReviews} Reviews
                    </p>
                  </div>
                </div>
                <div className="col-12 col-sm-8">
                  <div className="submit_review p-3">
                    <div className="select_rating">
                      <h4 className="mb-2">Submit Review</h4>
                      {userInfo ? (
                        <form onSubmit={submitHandler}>
                          <select
                            id="review_select"
                            className="w-100 p-2 mb-1"
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option>Choose Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                          <textarea
                            id="review_text"
                            className="w-100 p-3"
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="Leave a comment here"
                            required
                          ></textarea>
                          <button
                            disabled={loadReview}
                            type="submit"
                            className="btn btn-primary"
                          >
                            {loadReview ? <Spinner /> : "Submit"}
                          </button>
                        </form>
                      ) : (
                        <MessageBox variant="danger">
                          Please{" "}
                          <Link
                            to={`/signin?redirect=/product/${product.slug}`}
                          >
                            Sign In
                          </Link>{" "}
                          to write a review
                        </MessageBox>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tabset_wrapper container p-2 bg-white mt-2 mb-3">
              <div className="tabset">
                <input
                  type="radio"
                  name="tabset"
                  id="tab1"
                  aria-controls="marzen"
                />
                <label htmlFor="tab1">Reviews ({product.numReviews})</label>
                <input
                  defaultChecked
                  type="radio"
                  name="tabset"
                  id="tab2"
                  aria-controls="rauchbier"
                />
                <label htmlFor="tab2">Description</label>
                <div className="tab-panels">
                  <section id="marzen" className="tab-panel">
                    <h3>All Reviews : </h3>
                    {product.reviews.length === 0 ? (
                      <MessageBox className="mt2" variant="warning">
                        There are no reviews yet
                      </MessageBox>
                    ) : (
                      <>
                        {product.reviews.map((review) => (
                          <div
                            key={review._id}
                            className="review_card_wrapper border p-1 m-2 mx-0 "
                          >
                            <div className="review_card p-2">
                              <div className="review_name_date">
                                <h5>{review.name}</h5>
                                <h6>
                                  {new Date(review.createdAt)
                                    .toString()
                                    .substring(0, 25)}
                                </h6>
                              </div>
                              <p>
                                <Rating
                                  rating={review.rating}
                                  caption=" "
                                ></Rating>
                              </p>
                              <p>{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </section>
                  <section id="rauchbier" className="tab-panel">
                    <h3>Description : </h3>
                    <p
                      className="p-2"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    ></p>
                  </section>
                </div>
              </div>
            </div>
            {relatedProducts.length > 0 ? (
              <div className="related_products_section container mt-2 mb-3">
                <h3 className="mb-2">
                  <Component size={20} /> Related Products
                </h3>
                <Splide
                  options={{
                    rewind: true,
                    autoplay: false,
                    pagination: false,
                    arrows: true,
                    perPage: 5,
                    gap: 10,
                    lazyLoad: true,
                    mediaQuery: "max",
                    breakpoints: {
                      1000: {
                        perPage: 4,
                      },
                      768: {
                        perPage: 3,
                      },
                      550: {
                        perPage: 2,
                      },
                      380: {
                        perPage: 1,
                      },
                    },
                  }}
                >
                  {relatedProducts &&
                    relatedProducts.map((product) => (
                      <SplideSlide key={product._id}>
                        <ProductCard product={product} key={product.slug} />
                      </SplideSlide>
                    ))}
                </Splide>
              </div>
            ) : null}
          </div>
          <NewsLetter />
          <Footer />
          <BottomFooter />
        </div>
      )}
    </>
  );
}

export default ProductScreen;
