import React, { useEffect, useReducer } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import axios from "axios";
import { Link } from "react-router-dom";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, banners: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Slider = () => {
  const [{ banners }, dispatch] = useReducer(reducer, {
    banners: [],
    error: "",
  });

  useEffect(() => {
    const fetchBanner = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`${backUrl()}/api/banners`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchBanner();
  }, []);

  return (
    <>
      {banners.length > 0 && (
        <div className="mt-2 mb-2">
          <Splide
            options={{
              rewind: true,
              autoplay: true,
              pagination: false,
              arrows: true,
            }}
          >
            {banners.map((banner) => (
              <SplideSlide key={banner._id}>
                <div className="p-2">
                  <div className="slider_wrapper bg-white d-flex align-items-center justify-content-around p-3">
                    <div className="slider_text_wrapper m-sm-4 d-flex flex-column justify-content-center p-2">
                      <h3 className="mb-1 mb-sm-3 text-break text-uppercase">
                        {banner.name}
                      </h3>
                      <p className="mb-1 mb-sm-3 text-break">
                        {banner.description}
                      </p>
                      <p>
                        <Link to={`/product/${banner.link}`}>
                          <button className="btn btn-sm btn-primary w-100">
                            View Details
                          </button>
                        </Link>
                      </p>
                    </div>
                    <div className="slider_img_wrapper m-sm-4 text-center">
                      <img loading="lazy" src={banner.image} alt="" />
                    </div>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      )}
    </>
  );
};

export default Slider;
