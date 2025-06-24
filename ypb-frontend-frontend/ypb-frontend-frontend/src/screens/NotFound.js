import React from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <div className="mt-5 mb-3">
      <Helmet>
        <title>Page not Found| Jotters Pk</title>
      </Helmet>
      <div
        style={{
          height: "70vh",
        }}
        className="d-flex justify-content-center align-items-center flex-column"
      >
        <div>
          <h5 className="fw-bold">
            Oops! The page you are looking for can't be found.
          </h5>
        </div>
        <div>
          <h1
            style={{
              fontSize: "15rem",
            }}
            className="fw-bold"
          >
            404
          </h1>
        </div>
        <div>
          <a href="/">
            <button className="btn btn-primary">Back to Homepage</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
