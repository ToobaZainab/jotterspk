import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="top-to-btm">
      {showTopBtn && (
        <button
          className="btn btn-success icon-position icon-style"
          onClick={goToTop}
        >
          <i className="fa fa-arrow-up" aria-hidden="true"></i>
        </button>
      )}{" "}
    </div>
  );
};
export default ScrollToTop;
