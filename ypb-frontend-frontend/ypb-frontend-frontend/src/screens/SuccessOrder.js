import React from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { Helmet } from "react-helmet-async";

const SuccessOrder = () => {
  const myString = window.location.href.toString();
  const stringLength = myString.length;
  const id = myString.substr(stringLength - 24);

  return (
    <>
      <Helmet>
        <title>Order Success | Jotters Pk</title>
      </Helmet>
      <div
        style={{
          background: "#d1ffbd",
        }}
        className="container main-success-container mt-5 mb-3"
      >
        <div className="main-success-div p-5 mt-5">
          <div className="success-checkmark-div d-flex justify-content-center">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <Confetti numberOfPieces={400} className="confetti-success" />
            <h3 className="text-success mt-3">Thank You!</h3>
            <h4 className="text-break">Your Order Id is #{id}</h4>
            <h5 className="text-break">
              Order tracking Id will be provided soon.
            </h5>
            <h6 className="text-break">
              Your Order will be delivered to you in 3-4 working days
            </h6>
            <div className="btn-success-div">
              <Link to={`/order/${id}`}>
                <button className="mt-3 btn btn-success">
                  View Order Details
                </button>
              </Link>
            </div>
            <div className="btn-success-div">
              <a href="/">
                <button className="mt-3 btn btn-success">
                  Back to Homepage
                </button>
              </a>
            </div>
          </div>
          <div className="row mt-4">
            <hr />
            <p className="text-center text-decoration-underline">
              For furthur enquiries related to your order
            </p>
            <div className="col-12 col-md-6 col-lg-6 text-center ">
              <p>
                WhatsApp: <br />
                <b>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="text-dark"
                    href="https://api.whatsapp.com/send?phone=923146134122"
                  >
                    +92 3146134122
                  </a>
                </b>
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-6 text-center">
              <p>
                Email at: <br />
                <b>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className=" text-dark"
                    href="mailto:yourprofitbazar@gmail.com"
                  >
                    yourprofitbazar@gmail.com
                  </a>
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessOrder;
