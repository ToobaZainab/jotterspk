import { Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ScrollToTop from "./components/ScrollToTop";
import CreateProduct from "./screens/CreateProduct";
import SuccessOrder from "./screens/SuccessOrder";
import NotFound from "./screens/NotFound";
import AllReviews from "./screens/AllReviews";
import BannersList from "./screens/BannersList";
import CreateBanner from "./screens/CreateBanner";
import ResellerRoute from "./components/ResellerRoute";
import ResellerDashboard from "./screens/ResellerDashboard";
import WithdrawReseller from "./screens/WithdrawReseller";
import TransactionHistory from "./screens/TransactionHistory";
import AllTransactionsList from "./screens/AllTransactionsList";
import TransactionScreen from "./screens/TransactionScreen";
import CreateAnnoucement from "./screens/CreateAnnoucement";
import AnnoucementList from "./screens/AnnoucementList";
import EmailVerifyScreen from "./screens/EmailVerifyScreen";
import BecomeaReseller from "./screens/BecomeaReseller";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import BannerEdit from "./screens/BannerEdit";
import { inject } from "@vercel/analytics";
import PaymentSuccess from "./screens/PaymentSuccess";
import Chat from "./helpers/Chat";

function App() {
  inject();
  return (
    <>
      <ToastContainer position="bottom-right" limit={4} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/product/:slug" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/forget-password" element={<ForgetPasswordScreen />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordScreen />}
          />
          <Route path="/verify/:id/:token" element={<EmailVerifyScreen />} />

          <Route path="/become-a-reseller" element={<BecomeaReseller />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/ordersuccess" element={<SuccessOrder />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderScreen />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/orderhistory"
            element={
              <ProtectedRoute>
                <OrderHistoryScreen />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
          {/* Reseller Routes */}
          <Route
            path="/reseller/dashboard"
            element={
              <ResellerRoute>
                <ResellerDashboard />
              </ResellerRoute>
            }
          ></Route>

          <Route
            path="/profile/withdraw"
            element={
              <ResellerRoute>
                <WithdrawReseller />
              </ResellerRoute>
            }
          />
          <Route
            path="/reseller/mytransactions"
            element={
              <ResellerRoute>
                <TransactionHistory />
              </ResellerRoute>
            }
          />
          <Route
            path="/withdraw/:id"
            element={
              <ProtectedRoute>
                <TransactionScreen />
              </ProtectedRoute>
            }
          ></Route>
          {/* Admin Routes */}

          <Route
            path="/admin/allwithdraws"
            element={
              <AdminRoute>
                <AllTransactionsList />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <DashboardScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderListScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserListScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/allreviews"
            element={
              <AdminRoute>
                <AllReviews />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/create/banner"
            element={
              <AdminRoute>
                <CreateBanner />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/banner/:id"
            element={
              <AdminRoute>
                <BannerEdit />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/bannerslist"
            element={
              <AdminRoute>
                <BannersList />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/create/announcement"
            element={
              <AdminRoute>
                <CreateAnnoucement />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/announcementlist"
            element={
              <AdminRoute>
                <AnnoucementList />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductListScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/products/create"
            element={
              <AdminRoute>
                <CreateProduct />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/product/:id"
            element={
              <AdminRoute>
                <ProductEditScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/user/:id"
            element={
              <AdminRoute>
                <UserEditScreen />
              </AdminRoute>
            }
          ></Route>
          <Route path="/" element={<HomeScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Chat />
      <ScrollToTop />
    </>
  );
}

export default App;
