import React from "react";

const InfoBoxes = () => {
  return (
    <div className="container-fluid mt-3 mb-3">
      <div className="card_wrapper">
        <div className="card_info m-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-4 text-end">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/dusk/64/truck.png"
                alt="truck"
              />
            </div>
            <div className="col-8 ">
              <h6 style={{ color: "#12a6cc", fontWeight: "bold" }}>
                Free Shipping
              </h6>
              <p style={{ fontSize: "11px" }}>For Orders Above 1500PKR</p>
            </div>
          </div>
        </div>
        <div className="card_info m-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-4 text-end">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/dusk/64/gift--v1.png"
                alt="gift--v1"
              />
            </div>
            <div className="col-8 ">
              <h6 style={{ color: "#12a6cc", fontWeight: "bold" }}>
                Weekly Offers
              </h6>
              <p style={{ fontSize: "11px" }}>Save upto 20% on top products</p>
            </div>
          </div>
        </div>
        <div className="card_info m-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-4 text-end">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/office/40/headset.png"
                alt="headset"
              />
            </div>
            <div className="col-8 ">
              <h6 style={{ color: "#12a6cc", fontWeight: "bold" }}>
                24/7 Support
              </h6>
              <p style={{ fontSize: "11px" }}>Live chat with our admins</p>
            </div>
          </div>
        </div>
        <div className="card_info m-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-4 text-end">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/dusk/64/discount.png"
                alt="discount"
              />
            </div>
            <div className="col-8 ">
              <h6 style={{ color: "#12a6cc", fontWeight: "bold" }}>
                Affordable Prices
              </h6>
              <p style={{ fontSize: "11px" }}>Get wholesale prices directly</p>
            </div>
          </div>
        </div>
        <div className="card_info m-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-4 text-end">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-cash-on-delivery-web-store-flaticons-lineal-color-flat-icons-4.png"
                alt="external-cash-on-delivery-web-store-flaticons-lineal-color-flat-icons-4"
              />
            </div>
            <div className="col-8 ">
              <h6 style={{ color: "#12a6cc", fontWeight: "bold" }}>
                Cash on Delivery
              </h6>
              <p style={{ fontSize: "11px" }}>Available all over Pakistan</p>
            </div>
          </div>
        </div>
        <div className="card_info m-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-4 text-end">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-easy-return-logistics-flaticons-lineal-color-flat-icons.png"
                alt="external-easy-return-logistics-flaticons-lineal-color-flat-icons"
              />
            </div>
            <div className="col-8 ">
              <h6 style={{ color: "#12a6cc", fontWeight: "bold" }}>
                Return Policy
              </h6>
              <p style={{ fontSize: "11px" }}>Easy Return within 10 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBoxes;
