import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "./../Store";
import { X } from "lucide-react";

const OffCanvas = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  return (
    <>
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <a href="/">
            <img style={{ width: "120px" }} src="/images/logo.jpeg" alt="" />
          </a>
          <button
            style={{ background: "none", border: "0px", color: "#000" }}
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <X />
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="sidebar_items d-flex flex-column">
            {userInfo && (
              <p className="mb-3">
                <span>Welcome ,</span>
                <p className="text-decoration-underline ">{userInfo?.name}</p>
              </p>
            )}
            <Link to="/">
              <li data-bs-dismiss="offcanvas">
                <span>
                  <i className="fa fa-home" aria-hidden="true"></i>
                </span>
                <span>Home</span>
              </li>
            </Link>
            <Link to="/search">
              <li data-bs-dismiss="offcanvas">
                <span>
                  <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                </span>
                <span>Shop</span>
              </li>
            </Link>
            <Link
              className={
                userInfo?.isReseller === true
                  ? "d-none"
                  : userInfo?.isAdmin === true
                  ? "d-none"
                  : ""
              }
              to="/become-a-reseller"
            >
              <li data-bs-dismiss="offcanvas">
                <span>
                  <i className="fa fa-usd" aria-hidden="true"></i>
                </span>
                <span>Become Reseller</span>
              </li>
            </Link>
            {userInfo ? (
              <>
                <Link
                  className={userInfo?.isAdmin === true ? "" : "d-none"}
                  to="/admin/dashboard"
                >
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                    </span>
                    <span>Admin Dashboard</span>
                  </li>
                </Link>
                <Link
                  className={userInfo?.isReseller === true ? "" : "d-none"}
                  to="/reseller/dashboard"
                >
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                    </span>
                    <span>Reseller Dashboard</span>
                  </li>
                </Link>
                <Link
                  className={userInfo?.isReseller === true ? "" : "d-none"}
                  to="/reseller/mytransactions"
                >
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-usd" aria-hidden="true"></i>
                    </span>
                    <span>Transaction History</span>
                  </li>
                </Link>
                <Link to="/profile">
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>
                    <span>My Profile</span>
                  </li>
                </Link>
                <Link to="/orderhistory">
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-history" aria-hidden="true"></i>
                    </span>
                    <span>Order History</span>
                  </li>
                </Link>
                <Link onClick={signoutHandler}>
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-sign-out" aria-hidden="true"></i>
                    </span>
                    <span>Logout</span>
                  </li>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-sign-in" aria-hidden="true"></i>
                    </span>
                    <span>Login</span>
                  </li>
                </Link>
                <Link to="/signup">
                  <li data-bs-dismiss="offcanvas">
                    <span>
                      <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </span>
                    <span>Signup</span>
                  </li>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OffCanvas;
