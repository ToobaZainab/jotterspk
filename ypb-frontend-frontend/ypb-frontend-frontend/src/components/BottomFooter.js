import { ArrowRight } from "lucide-react";
import React from "react";

const BottomFooter = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap p-3">
        <div className="reserved_rights">
          All Rights reserved by Jotters PK © 2023
        </div>
        <div className="developer_id">
          Developed By{" "}
          <ArrowRight size={16} color="#000000" strokeWidth={0.5} />
          &nbsp;
          <span
            target="_blank"
            rel="noopener noreferrer"
          >
            Tooba Zainab & Aneeza Zafar{" "}
          </span>
          {/* <a href=" " target="_blank" rel="noopener noreferrer">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/fluency/48/linkedin.png"
              alt="linkedin"
            />
          </a>
          <a href=" " target="_blank" rel="noopener noreferrer">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/fluency/48/instagram-new.png"
              alt="instagram-new"
            />
          </a> */}
        </div>
      </div>
    </>
  );
};

export default BottomFooter;
