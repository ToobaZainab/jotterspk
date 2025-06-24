import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AlignLeft } from "lucide-react";
import SearchBar from "./SearchBar";
import OffCanvas from "./OffCanvas";
import { Store } from "./../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import axios from "axios";
import { backUrl } from "../helpers/Url";

const Navbar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  const [load, setLoad] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoad(true);
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/products/categories`
        );
        setCategories(data);
        setLoad(false);
      } catch (err) {
        setLoad(false);
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  return (
    <>
      <nav className="d-flex sticky-top justify-content-between align-items-center p-2 bg-white">
        <div className="nav_logo">
          <button
            id="nav_menu_btn"
            style={{
              outline: "none",
            }}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasWithBothOptions"
            aria-controls="offcanvasWithBothOptions"
            className="nav_search_btn text-dark"
          >
            <AlignLeft color="#000000" size={28} strokeWidth={1.5} />
            <p>Menu</p>
          </button>
          <a href="/">
            <img style={{ width: "8rem" }} src="/images/logo.jpeg" alt="" />
          </a>
        </div>
        <div className="nav_full_search">
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <button
                type="button"
                className={
                  load
                    ? "d-none"
                    : "btn btn-light border-dark btn-sm dropdown-toggle dropdown-toggle-split"
                }
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="">Category</span>
              </button>
              <ul className="dropdown-menu overflow-auto">
                {categories.map((category) => (
                  <li key={category} className="overflow-auto">
                    <Link
                      className="dropdown-item p-1"
                      to={`/search?category=${category}&query=all&price=all&rating=all&order=newest&page=1`}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
              <input
                name="q"
                id="q"
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search a product ..."
                className="form-control border-dark"
                aria-label="Text input with segmented dropdown button"
              />
              <button
                data-bs-dismiss="modal"
                type="submit"
                className="btn btn-outline-secondary border-dark rounded-end-2"
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
          </form>
        </div>
        <div className="nav_items">
          <NavLink to="/" className="m-2 nav_item">
            Home
          </NavLink>
          <NavLink to="/search" className="m-2 nav_item">
            Shop
          </NavLink>
          <NavLink
            className={
              userInfo?.isReseller === true
                ? "d-none"
                : userInfo?.isAdmin === true
                ? "d-none"
                : "m-2 nav_item"
            }
            to="/become-a-reseller"
          >
            Become Reseller
          </NavLink>
          {userInfo ? (
            <span className="dropdown nav_item">
              <button
                style={{
                  border: "0px",
                  background: "#fff",
                  fontSize: "1.1rem",
                }}
                className="dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userInfo.name.toString().substring(0, 15)}
              </button>
              <ul className="dropdown-menu p-1">
                {userInfo.isAdmin && (
                  <li>
                    <Link to="/admin/dashboard" className="dropdown-item p-1">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {userInfo.isReseller && (
                  <li>
                    <Link
                      className="dropdown-item p-1"
                      to="/reseller/dashboard"
                    >
                      Reseller Dashboard
                    </Link>
                  </li>
                )}
                {userInfo.isReseller && (
                  <li>
                    <Link
                      className="dropdown-item p-1"
                      to="/reseller/mytransactions"
                    >
                      Transaction History
                    </Link>
                  </li>
                )}
                <li>
                  <Link className="dropdown-item p-1" to="/profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-1" to="/orderhistory">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-1" onClick={signoutHandler}>
                    Logout
                  </Link>
                </li>
              </ul>
            </span>
          ) : (
            <span>
              <NavLink to="/signin" className="m-2 nav_item">
                Login
              </NavLink>
              <NavLink to="/signup" className="m-2 nav_item">
                Signup
              </NavLink>
            </span>
          )}
          <button
            style={{
              outline: "0",
              boxShadow: "none",
            }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="nav_search_btn me-1"
          >
            <i className="fa fa-search fs-5 text-dark" aria-hidden="true"></i>
          </button>
          {cart?.cartItems?.length > 0 ? (
            <NavLink
              id="noHoverEffect"
              to="/cart"
              className="position-relative me-3"
            >
              <i
                className="fa fa-shopping-bag text-dark fs-4"
                aria-hidden="true"
              ></i>
              <span
                style={{
                  top: "-17px",
                  bottom: "17px",
                  right: "-19px",
                }}
                className="position-absolute badge rounded-pill cart_badge"
              >
                {cart?.cartItems?.length}
              </span>
            </NavLink>
          ) : (
            <NavLink
              id="noHoverEffect"
              to="/cart"
              className="position-relative me-3"
            >
              <i
                className="fa fa-shopping-bag text-dark fs-4"
                aria-hidden="true"
              ></i>
              <span
                style={{
                  top: "-17px",
                  bottom: "17px",
                  right: "-19px",
                }}
                className="position-absolute badge rounded-pill cart_badge"
              >
                0
              </span>
            </NavLink>
          )}
        </div>
      </nav>
      <OffCanvas />
      <SearchBar />
    </>
  );
};

export default Navbar;
