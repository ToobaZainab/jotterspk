import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getError } from "../utils";
import axios from "axios";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import BottomFooter from "../components/BottomFooter";
import { backUrl } from './../helpers/Url';

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const BecomeaReseller = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const userId = userInfo ? userInfo._id : "";
  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [email, setEmail] = useState(userInfo ? userInfo.email : "");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [heard, setHeard] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please login or signup to continue");
      return;
    }
    if (userInfo?.isReseller === true) {
      toast.error("You are already a Reseller");
      return;
    }
    if (userInfo?.isAdmin === true) {
      toast.error("You are an Admin");
      return;
    }
    if (phone !== "" && phone.length !== 11) {
      toast.error("Phone number should be 11 digits.");
      return;
    }
    try {
      dispatch({
        type: "CREATE_REQUEST",
      });
      await axios.post(
        `${backUrl()}/api/users/becomereseller`,
        {
          userId,
          name,
          email,
          phone,
          profession,
          heard,
          message,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      setPhone("");
      setHeard("");
      setMessage("");
      setProfession("");
      toast.success("Reseller Request sent successfully.");
    } catch (err) {
      dispatch({
        type: "CREATE_FAIL",
      });
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Helmet>
        <title>Become a reseller | Jotters Pk</title>
      </Helmet>
      <div className="container rounded-3 mt-2 mb-4">
        <div className="row">
          <form onSubmit={handleSubmit} className="p-4 rounded-3 bg-white">
            <div className="row">
              <h2 className="text-center mb-3">Become a Reseller</h2>
              <p className="text-center">
                <i className="bi bi-info-square-fill"></i> If we do not respond
                you within 2-3 working days, then contact us directly on
                whatsapp.
              </p>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name *
                </label>
                <input
                  value={name ? name : ""}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  required
                />
              </div>
              <div
                id="email-input"
                className="col-12 col-sm-6 col-md-6 col-lg-6 "
              >
                <label
                  htmlFor="exampleFormControlInput2"
                  className="form-label"
                >
                  Email address *
                </label>
                <input
                  value={email ? email : ""}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput2"
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Phone Number *
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="Number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  required
                />
              </div>
              <div
                id="email-input"
                className="col-12 col-sm-6 col-md-6 col-lg-6 "
              >
                <label
                  htmlFor="exampleFormControlInput2"
                  className="form-label"
                >
                  Are u a Student?
                </label>
                <select
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  className="form-control"
                  name="category"
                  id="exampleFormControlInput2"
                >
                  <option value="">Choose Options</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="row my-2 ">
                <label
                  htmlFor="exampleFormControlInput4"
                  className="form-label"
                >
                  From where you heard about us?
                </label>
                <select
                  onChange={(e) => setHeard(e.target.value)}
                  required
                  className="form-control mx-3"
                  name="category"
                  id="exampleFormControlInput4"
                >
                  <option value="">Choose Options</option>
                  <option key="Friends" value="Friends">
                    Friends
                  </option>
                  <option key="Social" value="Social Media">
                    Social Media(fb,insta,twitter,youtube etc.)
                  </option>
                  <option key="Internet" value="Internet">
                    Google (Internet)
                  </option>
                  <option key="other" value="Other">
                    Other
                  </option>
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Enter a message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="4"
                  placeholder="Leave a message. (It can be anything that you want us to improve about our website)."
                ></textarea>
                <div className="form-check mt-2 ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    defaultChecked
                    readOnly
                    disabled
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckChecked"
                  >
                    I agree to all the Terms and Conditions
                  </label>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary btn-sm mt-3"
                >
                  {loading ? <Spinner></Spinner> : "Send Now"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="container rounded-3 bg-white p-2">
        <h3 className="text-center mt-3">Frequently Asked Questions (FAQ's)</h3>
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                What is a Reseller?
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                A Reseller can sale our products to their customers with his/her
                name tag without even buying from our shop and will get his/her
                profit in his account balance. He/She can start earning wthout a
                single investment. (Same like dropshipping)
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                How Reseller will deliver the products?
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                Resellers don't have to worry about the delivery of the
                products. We cover it all, we will deliver the products to your
                customers with your name tag on it and the customer will not
                know that it was us who delivered the parcel.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                What are the benefits of a Reseller?
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                Resellers can buy the products for themselves with no delivery
                charges or can sale them to their customers with their name tags
                and their profit will be deposited in their accounts. As all the
                products are with wholesale prices, resellers get a benfit of
                high profit margin on each product. And the amount will be
                depsited to his account balance.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                How Resellers will recieve their withdraw amount?
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                It's very easy to recieve your amount. You just go to your
                Dashboard &gt; Withdraw amount and provide us your account
                details. We will process your withdraw in 3-4 working days and
                send your amount to the given account details.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="false"
                aria-controls="collapseFive"
              >
                Which accounts are accepted for withdraw?
              </button>
            </h2>
            <div
              id="collapseFive"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                Reselers can take withdraw in their Bank Acconts(HBL, UBL,
                MEEZAN, etc.), JAZZCASH, EASYPAISA, NAYAPAY, SADAPAY. You can
                take your withdraw in any account which is officially available
                in Pakistan.
              </div>
            </div>
          </div>
          <div className="accordion-item mb-5">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseSix"
                aria-expanded="false"
                aria-controls="collapseSix"
              >
                Terms and Conditions
              </button>
            </h2>
            <div
              id="collapseSix"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                Thank you for your interest in becoming a reseller of Your
                Profit Bazar. Below are the terms and conditions that you must
                comply with in order to become a reseller:
                <ul>
                  <li>
                    <b>Eligibility :</b> There is no age restriction for
                    becoming a reseller of Your Profit Bazar. All you need to do
                    is provide correct information.
                  </li>
                  <li>
                    <b>Application :</b> To become a reseller, you must fill out
                    an application form that includes your name, contact
                    information and profession. Please provide correct number so
                    we could add you in our Reseller Group of WhatsApp where you
                    can have a lot of benefits. We reserve the right to approve
                    or reject your application at our discretion.
                  </li>
                  <li>
                    <b>Approval :</b> If your application is approved, you will
                    receive a confirmation email from us that outlines the terms
                    and conditions of our reseller program. You must agree to
                    these terms and conditions in order to participate in the
                    program.
                  </li>
                  <li>
                    <b>Pricing :</b> As a reseller, you will receive discounted
                    pricing on our products. The specific discount will be
                    outlined in the confirmation email. You may not advertise or
                    sell our products at a price lower than the minimum
                    advertised price that we establish for each product.
                  </li>
                  <li>
                    <b>Sales :</b> You are responsible for all sales that you
                    make as a reseller. You may not misrepresent our products or
                    make false claims about their performance or quality.
                  </li>
                  <li>
                    <b>Shipping :</b> Shipping costs are the responsibility of
                    the reseller. We will provide you with a shipping quote
                    prior to shipping your order. In case, customer do not
                    receive the product the shipping charges will be conducted
                    from your balance.
                  </li>
                  <li>
                    <b>Returns:</b> If a customer requests a return or refund
                    just for the change of mind, we are not responsible for
                    processing the return and issuing the refund. We are only
                    responsible if the product(s) is/are damged, broken or not
                    according to the given order(video proof required). If such
                    things happen contact Admin as soon as possible or seek for
                    help on our whatsApp number.
                  </li>
                  <li>
                    <b>Trademarks:</b> You may not use our trademarks or logos
                    without our prior written permission.
                  </li>
                  <li>
                    <b>Termination:</b> We reserve the right to terminate your
                    participation in the reseller program at any time for any
                    reason.
                  </li>
                </ul>
                <p>
                  We hope that these terms and conditions are clear and easy to
                  understand. If you have any questions or concerns, please do
                  not hesitate to contact us. We look forward to working with
                  you as a reseller of Your Profit Bazar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-3 mb-3 p-3 bg-white">
        <div className="row  text-break">
          <h2 className="text-center">What We Provide?</h2>
          <div className="col-lg-4 col-md-4 col-sm-12  p-3  text-center">
            <div className="h-100 about-content">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/nolan/64/hot-price.png"
                alt="hot-price"
              />
              <h3>Best Prices & Offers</h3>
              <p className="text-center">
                All Products are tested before they are bought in and are at the
                Wholesale prices. The products will be the same as shown in the
                pictures. (Sometimes colour may slightly vary due to screen
                resolution.)
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3 text-center">
            <div className="h-100 about-content">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/nolan/64/warranty-card.png"
                alt="warranty-card"
              />
              <h3>Best For Trust & Quality</h3>
              <p className="text-center">
                “Trust starts with truth and ends with truth.” What separates
                Your Profit Bazar from others is truth. Your Profit Bazar trade
                program in a focused, yet complementary product range. We are
                publicly providing our services. We provide Cash on Delivery to
                build our Trust.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/external-goofy-color-kerismaker/96/external-Fast-Delivery-logistic-goofy-color-kerismaker.png"
                alt="external-Fast-Delivery-logistic-goofy-color-kerismaker"
              />
              <h3>Fast Delivery System</h3>
              <p className="text-center">
                All products are shipped within 24 hours of confirmation of
                order. We provide tracking to all our Resellers and customers.If
                you purchase more than one item it will be packaged together and
                shipped under one tracking number.
              </p>
            </div>
          </div>
        </div>
        <div className="row text-break">
          <div className="col-lg-4 col-md-4 col-sm-12  p-3  text-center">
            <div className="h-100 about-content">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-easy-return-logistics-flaticons-lineal-color-flat-icons.png"
                alt="external-easy-return-logistics-flaticons-lineal-color-flat-icons"
              />
              <h3>Easy Returns Service</h3>
              <p className="text-center">
                All our products cover a warranty. The warranty covers all the
                damaged products during delivery or not receiving your exact
                products(video proof required). On our products we DO NOT offer
                refunds however will offer an exchange depending on the date of
                purchase.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-satisfied-customer-feedback-flaticons-flat-flat-icons.png"
                alt="external-satisfied-customer-feedback-flaticons-flat-flat-icons"
              />
              <h3>100% satisfication</h3>
              <p className="text-center">
                If a product is returned as faulty it has to be fully tested by
                us before replacement can be offered, testing time starts upon
                returning the device and can take up to 1-3 working days. If a
                fault cannot be reproduced then no exchange will be authorised
                and the device will be returned to you immediately. Any products
                exchange must be returned in the original condition with all
                accessories.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/dusk/64/delivery--v1.png"
                alt="delivery--v1"
              />
              <h3>Delivery Delay</h3>
              <p className="text-center">
                Please note that during National holidays such as EID Holidays,
                New Years eve and courires holidays etc., these may have
                delivery delays which we are not responsible for. During
                Lockdown we will continue working and try our best to provide
                prompt shipping however this may cause delays as couriers may
                have internal delays for deliveries.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
      <BottomFooter />
    </>
  );
};

export default BecomeaReseller;
