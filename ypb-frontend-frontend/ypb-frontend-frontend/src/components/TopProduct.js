import React from "react";
import { Link } from "react-router-dom";

const TopProduct = ({ topProduct }) => {
  const product = topProduct;

  return (
    <div className="top_product mt-3 mb-3">
      <div className="top_product_wrapper bg-white p-3">
        <div className="top_product_text">
          <h4 className="fw-bold">Top Product of the Month</h4>
          <h6>{product?.name}</h6>
          <Link to={`/product/${product?.slug}`}>
            <button className="btn btn-sm btn-outline-primary w-100">
              View Details
            </button>
          </Link>
        </div>
        <div className="top_product_img">
          <img loading="lazy" src={product?.image} alt="" />
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
