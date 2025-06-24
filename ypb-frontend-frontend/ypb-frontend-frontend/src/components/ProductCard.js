import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import Rating from "./Rating";
import { toast } from "react-toastify";
import { backUrl } from "../helpers/Url";

const ProductCard = (props) => {
  const { product } = props;
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${backUrl()}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product stock is limited.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    toast.success("Item added to cart");
  };

  const orderNowHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${backUrl()}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product stock is limited.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    navigate("/cart");
    toast.success("Item added to cart");
  };

  return (
    <>
      <div className="product_card_wrapper p-2 bg-white">
        {product?.offerPrice > 0 && (
          <span className="position-absolute badge fw-light bg_green_logo">
            On Sale !
          </span>
        )}
        {product?.price >= 1499 && (
          <span
            style={{
              right: "5px",
            }}
            className="position-absolute badge fw-light bg_green_logo"
          >
            Free Shipping
          </span>
        )}
        <div className="product_card">
          <Link to={`/product/${product?.slug}`}>
            <div className="product_img">
              <img loading="lazy" src={product.image} alt="" />
            </div>
          </Link>
          <div className="product_details mt-2 p-1">
            <div className="product_title">
              <Link className="text-dark" to={`/product/${product?.slug}`}>
                <div className="product_name">
                  <h6>{product.name}</h6>
                </div>
              </Link>
              <div className="product_price mt-2 d-flex justify-content-between align-items-center">
                <span id="product_price_original" className=" text-primary">
                  Rs.{product.price}
                </span>
                {product.offerPrice > 0 && (
                  <span id="product_price_cut">Rs.{product.offerPrice}</span>
                )}
                <span id="product_left">{product.countInStock} left</span>
              </div>
            </div>
            <div className="product_reviews d-flex justify-content-between align-items-center">
              <span>
                <Rating
                  rating={product.rating}
                  // numReviews={product.numReviews}
                />
              </span>
              <span id="product_sold">{product.sold} sold</span>
            </div>
            {product.countInStock > 0 ? (
              <div
                className={
                  product.colors?.length < 1
                    ? "product_card_footer mt-1"
                    : "d-none"
                }
              >
                {/* <button
                  onClick={() => orderNowHandler(product)}
                  className="btn btn-sm btn-primary w-100 mt-2"
                >
                  Order Now
                </button> */}
                <button
                  onClick={() => addToCartHandler(product)}
                  className="btn btn-sm btn-primary w-100 mt-2"
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="product_card_footer mt-1">
                <button className="btn btn-sm btn-danger disabled w-100 mt-2">
                  Out of Stock
                </button>
              </div>
            )}
            <div
              className={
                product.colors?.length > 1
                  ? "product_card_footer mt-1"
                  : "d-none"
              }
            >
              <Link
                to={`/product/${product?.slug}`}
                className="btn btn-outline-primary w-100 mt-2 py-1"
              >
                Choose Colors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
