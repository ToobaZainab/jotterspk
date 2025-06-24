import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getError } from "../utils";
import { toast } from "react-toastify";
import { backUrl } from "../helpers/Url";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  const [categories, setCategories] = useState([]);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoad(true);
      try {
        const { data } = await axios.get(`${backUrl()}/api/products/categories`);
        setCategories(data);
        setLoad(false);
      } catch (err) {
        setLoad(false);
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div
        className="modal fade animate__animated animate__zoomIn animate__faster"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                What are u looking for?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitHandler}>
                <div className="input-group">
                  <button
                    type="button"
                    className={
                      load
                        ? "d-none"
                        : "btn btn-dark dropdown-toggle dropdown-toggle-split"
                    }
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="">Category</span>
                  </button>
                  <input
                    name="q"
                    id="q"
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Search a product ..."
                    className="form-control border-dark"
                    aria-label="Text input with segmented dropdown button"
                  />
                  <button
                    data-bs-dismiss="modal"
                    type="submit"
                    className="btn btn-outline-secondary border-dark rounded-end-2"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li
                        key={category}
                        data-bs-dismiss="modal"
                        className="p-1"
                      >
                        <Link
                          className="dropdown-item"
                          to={`/search?category=${category}&query=all&price=all&rating=all&order=newest&page=1`}
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
