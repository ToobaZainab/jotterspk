import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import LoadingBox from "./../components/LoadingBox";
import { backUrl } from "../helpers/Url";

const EmailVerifyScreen = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;
  const token = params.token;

  useEffect(() => {
    const verifyEmailUrl = async () => {
      setLoading(true);
      try {
        await axios.get(`${backUrl()}/api/users/verify/${id}/${token}`);
        setLoading(false);
        setValidUrl(true);
      } catch (error) {
        setLoading(false);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [id, token]);

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : validUrl === true ? (
        <div
          style={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="user_profile_wrapper container mt-3 mb-3"
        >
          <div className="user_profile p-3">
            <div className="d-flex justify-content-center align-items-center ">
              <img
                style={{
                  width: "8rem",
                }}
                src="/images/icons8-check.gif"
                alt=""
              />
            </div>
            <div>
              <h5 className="text-center">Email Verified Successfully</h5>
            </div>
            <div className="mt-3">
              <Link to="/signin" className="btn btn-primary w-100 p-2">
                Login Now
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "80vw",
            margin: "auto",
          }}
          className="mt-5 mb-5"
        >
          <MessageBox variant="danger">
            Invalid Link or User does not exists
          </MessageBox>
        </div>
      )}
    </>
  );
};

export default EmailVerifyScreen;
