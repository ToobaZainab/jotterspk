import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="footer_wrapper bg-white p-3">
        <div className="footer_wrapper_grid">
          <div className="footer_childs footer_child_one">
            <img
              style={{ width: "8rem" }}
              id="footer_logo"
              src="/images/logo.jpeg"
              alt=""
            />
            <p className="mt-3 p-2">
              <span>Follow Us :</span>
              &nbsp;
              <a target="_blank" rel="noreferrer" href="https://www.instagram.com/jotters.pk?igsh=bW5yd3VoN3ExczAz">
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/fluency/48/instagram-new.png"
                  alt="instagram-new"
                />
              </a>
              {/* &nbsp;
              <a target="_blank" rel="noreferrer" href=" ">
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/fluency/48/facebook-new.png"
                  alt="facebook-new"
                />
              </a>
              &nbsp;
              <a target="_blank" rel="noreferrer" href=" ">
                <img width="40" src="/images/daraz.png" alt="facebook-new" />
              </a> */}
            </p>
          </div>
          <div className="footer_childs footer_child_two">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <ArrowRight size={20} color="#000000" strokeWidth={0.5} />{" "}
                <Link to="/">Home</Link>
              </li>
              <li>
                <ArrowRight size={20} color="#000000" strokeWidth={0.5} />{" "}
                <Link to="/search">Shop</Link>
              </li>
              <li>
                <ArrowRight size={20} color="#000000" strokeWidth={0.5} />{" "}
                <Link to="/become-a-reseller">Become Reseller</Link>
              </li>
              <li>
                <ArrowRight size={20} color="#000000" strokeWidth={0.5} />{" "}
                <Link to="">Track your Order</Link>
              </li>
            </ul>
          </div>
          <div className="footer_childs footer_child_three">
            <h3>Contact</h3>
            <ul>
              <li>
                <b>Phone :</b>{" "}
                <a target="_blank" rel="noreferrer" href=" ">
                +92 333 9946644
                </a>
              </li>
              <li>
                <b>WhatsApp :</b>{" "}
                <a target="_blank" rel="noreferrer" href=" ">
                +92 333 9946644
                </a>
              </li>
              <li>
                <b>Email :</b>{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="infoBox-link text-break"
                  href=" "
                >
                  info@jotterspk.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
