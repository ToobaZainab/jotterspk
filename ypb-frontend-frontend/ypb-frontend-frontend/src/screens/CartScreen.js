import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowDown, MoveRight, ArrowUp } from "lucide-react";
import React from "react";
import { backUrl } from "../helpers/Url";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`${backUrl()}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product stock is limited");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  const clearCartItems = () => {
    ctxDispatch({ type: "CART_CLEAR" });
    localStorage.setItem("cartItems", []);
    toast.success("Your cart is cleared");
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart | Jotters Pk</title>
      </Helmet>
      {cartItems.length === 0 ? (
        <div className="cart_page container mt-2 p-2">
          <h1 className="text-center mb-2">Shopping Cart</h1>
          <div className="cart_wrapper p-2 bg-white text-center">
            <img
              width="256"
              height="256"
              src="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/512/external-Empty-Cart-ecommerce-and-shopping-smashingstocks-flat-smashing-stocks.png"
              alt="external-Empty-Cart-ecommerce-and-shopping-smashingstocks-flat-smashing-stocks"
            />
            <h4>Oops! Your cart seems to be empty ...</h4>
            <h5>
              <Link to="/search">
                <button className="btn w-50 btn-primary mt-3 mb-2">
                  Shop Now
                </button>
              </Link>
            </h5>
          </div>
        </div>
      ) : (
        <div className="cart_page container mt-2 p-2">
          <h1 className="text-center mb-2">Shopping Cart</h1>
          <div className="cart_wrapper p-1 bg-white">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Product(s)</th>
                  <th scope="col">Quantity</th>
                  <th className="cart_subtotal" scope="col">
                    Price(pkr)
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="cart_product">
                      <div className="cart_product_img mx-2">
                        <Link to={`/product/${item.slug}`}>
                          <img src={item.image} alt={item.name} />
                        </Link>
                      </div>
                      <div className="cart_product_content">
                        <Link to={`/product/${item.slug}`}>
                          <p>{item.name}</p>
                        </Link>
                        <p>Price: {item.price}</p>
                        <p
                          className={
                            item.colors?.length < 1
                              ? "d-none"
                              : "text-capitalize"
                          }
                        >
                          color : {item.colors}
                        </p>
                        <p>
                          <span
                            onClick={() => removeItemHandler(item)}
                            className="text-danger cart_product_remove"
                          >
                            Remove
                          </span>
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="">
                        <div className="cart_qty">
                          <button
                            disabled={item.quantity === 1}
                            onClick={() =>
                              updateCartHandler(item, item.quantity - 1)
                            }
                            className="btn_cart_qty bg-danger"
                          >
                            <ArrowDown
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.75}
                            />
                          </button>
                          <input readOnly value={item.quantity} />
                          <button
                            disabled={item.quantity === item.countInStock}
                            onClick={() =>
                              updateCartHandler(item, item.quantity + 1)
                            }
                            className="btn_cart_qty"
                          >
                            <ArrowUp
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="cart_subtotal">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-3">
            <button
              onClick={clearCartItems}
              className="btn btn-sm btn-danger mb-2 "
            >
              Clear Cart
            </button>
          </div>
          <div className="cart_calculation bg-white d-flex justify-content-end">
            <div className="cart_total py-3 px-2">
              <div className="row mb-2 p-1">
                <div className="col text-start fw-bold">No. of Item(s)</div>
                <div className="col text-end">{cartItems.length}</div>
              </div>
              <div className="row mb-2 p-1">
                <div className="col text-start fw-bold">Total Qty</div>
                <div className="col text-end">
                  {cartItems.reduce((a, c) => a + c.quantity, 0)}
                </div>
              </div>
              <div className="row mb-2 p-1">
                <div className="col text-start fw-bold">Subtotal</div>
                <div className="col text-end">
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                </div>
              </div>
              <div className="row mt-2 mb-2 p-1">
                <div className="col text-start fw-bold">Tax/Charges</div>
                <div className="col text-end">0</div>
              </div>
              <div className="row mt-2 mb-2 p-1 border-top">
                <div className="col text-start fw-bold">Total</div>
                <div className="col text-end">
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                </div>
              </div>
              <div className="row px-3">
                <button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className={
                    cartItems.length === 0
                      ? "btn btn-dark btn-disabled"
                      : "text-white btn btn-primary p-1"
                  }
                  to="/shipping"
                >
                  Proceed to Checkout <MoveRight size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
