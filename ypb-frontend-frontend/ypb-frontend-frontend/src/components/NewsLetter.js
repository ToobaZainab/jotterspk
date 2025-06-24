import React from "react";

const NewsLetter = () => {
  return (
    <>
      <div className="news_wrapper d-flex align-items-center flex-column flex-sm-row p-4">
        <div className="subscriber_header text-start p-2">
          <h3 className="fw-bold text-white">Subscribe to our NewsLetter</h3>
          <p className="text-white">
            Get updates about new products and offers on weekly and monthly
            basis.
          </p>
        </div>
        <div className="subscriber_wrapper text-start text-sm-end p-2">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            id="subscriber_email"
          />
          <button>Subscribe</button>
        </div>
      </div>
    </>
  );
};

export default NewsLetter;
