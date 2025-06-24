import React from "react";

const Chat = () => {
  return (
    <div className="chat_btn_wrapper">
      <button className="btn btn-light btn-sm rounded-2 chat_btn">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://api.whatsapp.com/send?phone=923339946644"
        >
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/color/48/whatsapp--v1.png"
            alt="whatsapp--v1"
          />
        </a>
        <p
          style={{
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          Need Help?
        </p>
      </button>
    </div>
  );
};

export default Chat;
