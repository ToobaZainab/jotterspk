import { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Slider from "../components/Slider";
import TopProduct from "../components/TopProduct";
import NewsLetter from "../components/NewsLetter";
import BottomFooter from "../components/BottomFooter";
import InfoBoxes from "../components/InfoBoxes";
import { Store } from "../Store";
import { getError } from "../utils";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST_USER":
      return { ...state, loadingfetch: true };
    case "FETCH_SUCCESS_USER":
      return { ...state, user: action.payload, loadingfetch: false };
    case "FETCH_FAIL_USER":
      return { ...state, loadingfetch: false, error: action.payload };
    case "FETCH_REQUEST_ANMNT":
      return { ...state, loading: true };
    case "FETCH_SUCCESS_ANMNT":
      return { ...state, announcements: action.payload, loading: false };
    case "FETCH_FAIL_ANMNT":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_REQUEST_PRODUCTS":
      return { ...state, loading: true };
    case "FETCH_SUCCESS_PRODUCTS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL_PRODUCTS":
      return { ...state, loading: false, error: action.payload };
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

const HomeScreen = () => {
  // const navigate = useNavigate();

  const [{ loading, error, products, announcements }, dispatch] = useReducer(
    reducer,
    {
      announcements: [],
      products: [],
      loading: true,
      error: "",
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST_PRODUCTS" });
      try {
        const result = await axios.get(`${backUrl()}/api/products`);
        dispatch({ type: "FETCH_SUCCESS_PRODUCTS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL_PRODUCTS", payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchanmnt = async () => {
      dispatch({ type: "FETCH_REQUEST_ANMNT" });
      try {
        const result = await axios.get(`${backUrl()}/api/announcement`);
        dispatch({ type: "FETCH_SUCCESS_ANMNT", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL_ANMNT", payload: err.message });
      }
    };
    fetchanmnt();
  }, []);

  const bestDeals = products.filter((product) => product.offerPrice > 0);
  const topProductArr = products.filter(
    (product) => product.topProduct === true
  );
  const topProduct = topProductArr[0];
  const featurdProducts = products.filter(
    (product) => product.brand === "Your Profit Bazar"
  );

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const userId = userInfo?._id;

  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        dispatch({ type: "FETCH_REQUEST_USER" });
        try {
          const { data } = await axios.get(
            `${backUrl()}/api/users/mine/${userId}`,
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({ type: "FETCH_SUCCESS_USER", payload: data });
        } catch (error) {
          dispatch({
            type: "FETCH_FAIL_USER",
            payload: getError(error),
          });
          ctxDispatch({ type: "USER_SIGNOUT" });
          localStorage.removeItem("userInfo");
          localStorage.removeItem("shippingAddress");
          localStorage.removeItem("paymentMethod");
          localStorage.removeItem("cartItems");
          window.location.href = "/signin";
        }
      };
      fetchData();
    }
  }, [userId, userInfo, ctxDispatch]);

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Helmet>
            <title>Jotters Pk</title>
          </Helmet>
          <div className="container-fluid mt-2 mb-5">
            {announcements.length > 0 && (
              <div className="announcement_wrapper mt-2">
                <h6 className="announcement d-flex justify-content-center align-items-center text-uppercase">
                  {announcements.slice(-1).map((announcement) => (
                    <span key={announcement._id}>{announcement.title}</span>
                  ))}
                </h6>
              </div>
            )}
            <Slider />
            <div className="product_card_grid_wrapper mt-2 mb-2">
              <h2>Featured Products</h2>
            </div>
            {featurdProducts.length > 0 && (
              <div className="product_card_grid">
                {featurdProducts?.slice(-5).map((product) => (
                  <ProductCard product={product} key={product.slug} />
                ))}
              </div>
            )}
            {topProduct && <TopProduct topProduct={topProduct} />}
            <InfoBoxes />
            <div className="product_card_grid_wrapper mb-2">
              <h2>Best Deals</h2>
            </div>
            {bestDeals.length > 0 && (
              <div className="product_card_grid">
                {bestDeals?.slice(-5).map((product) => (
                  <ProductCard product={product} key={product.slug} />
                ))}
              </div>
            )}
          </div>
          <NewsLetter />
          <Footer />
          <BottomFooter />
        </div>
      )}
    </>
  );
};

export default HomeScreen;
