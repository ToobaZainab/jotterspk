import React from "react";

const Spinner = () => {
  return (
    <>
      <div className="text-center text-danger">
        <span
          className="spinner-border spinner-border-sm"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden" role="status">
          Loading...
        </span>
      </div>
    </>
  );
};

export default Spinner;
