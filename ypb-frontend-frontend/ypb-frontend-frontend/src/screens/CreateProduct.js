import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import Spinner from "../components/Spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function CreateProduct() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingCreate, loadingUpload }, dispatch] = useReducer(reducer, {
    error: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${backUrl()}/api/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const [topRated, setTopRated] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorArr, setColorArr] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState("");
  const [imagesUrl, setImagesUrl] = useState([]);

  const handleSlugChange = (event) => {
    const newText = event.target.value;
    setName(newText);
    const formattedText = newText.toLowerCase().replace(/\s+/g, "-");
    setSlug(formattedText);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData("index");
    const updatedImages = [...images];
    const [draggedImage] = updatedImages.splice(sourceIndex, 1);
    updatedImages.splice(targetIndex, 0, draggedImage);
    setImages(updatedImages);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (images.length > 5) {
      toast.error("Maximum images can be 5");
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(
        `${backUrl()}/api/products`,
        {
          name,
          slug,
          price,
          offerPrice,
          image,
          images,
          colors,
          category,
          brand,
          countInStock,
          description,
          highlights,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Product Created successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        `${backUrl()}/api/upload`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed.");
  };
  const handlePushClick = () => {
    setImages([...images, ...imagesUrl]);
    setImagesUrl([]);
  };
  const handleColorsClick = () => {
    setColors([...colors, ...colorArr]);
    setColorArr([]);
  };

  return (
    <>
      <Helmet>
        <title>Create Product | Jotters Pk</title>
      </Helmet>
      <div className="container-fluid mt-2 mb-3">
        <form onSubmit={submitHandler} className="admin_form_wrapper p-2">
          <div className="d-flex align-items-center mt-2 mb-2">
            <Link
              className="btn btn-sm btn-outline-primary p-1"
              to="/admin/products"
            >
              <i className="fa fa-arrow-left"></i> Go Back
            </Link>
            &nbsp;&nbsp;&nbsp;
            <h3>Add New Product</h3>
          </div>
          <div className="row  mt-2">
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  value={name}
                  onChange={handleSlugChange}
                  required
                  className="form-control"
                  id="floatingInput"
                  placeholder=""
                />
                <label htmlFor="floatingInput">Product Name</label>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="form-control"
                  id="floatingInput2"
                  placeholder=""
                />
                <label htmlFor="floatingInput2">Product Slug</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="Number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="form-control"
                  id="floatingInput3"
                  placeholder=""
                />
                <label htmlFor="floatingInput3">Product Price</label>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="Number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="form-control"
                  id="floatingInput4"
                  placeholder=""
                />
                <label htmlFor="floatingInput4">Discount/Offer Price</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingSelect">Select previous category</label>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  type="text"
                  className="form-control"
                  id="floatingInput5"
                  placeholder=""
                />
                <label htmlFor="floatingInput5">Add new category</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <select
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                >
                  <option value="">Choose Brand</option>
                  <option value="Jotters Pk">Jotters Pk</option>
                  <option value="No Brand">No Brand</option>
                </select>
                <label htmlFor="floatingSelect">Product Brand</label>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="Number"
                  className="form-control"
                  id="floatingInput5"
                  placeholder=""
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput5">Product Stock</label>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <div className="input-group mb-3">
                <input
                  type="text"
                  value={colorArr}
                  onChange={(e) => setColorArr([e.target.value])}
                  className="form-control text-capitalize"
                  placeholder="Add Color Variants"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <button
                  onClick={handleColorsClick}
                  className="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                >
                  Click to insert
                </button>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <input
                type="text"
                value={colors}
                onChange={() => setColors([])}
                className="form-control text-capitalize"
                placeholder="All Colors"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <h5>Description</h5>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <h5>Highlights</h5>
              <ReactQuill
                theme="snow"
                value={highlights}
                onChange={setHighlights}
                required
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <label className="input-group-text" htmlFor="inputGroupFile01">
                  Main Product Image
                </label>
                <input
                  onChange={uploadFileHandler}
                  accept="image/*"
                  type="file"
                  className="form-control"
                  id="inputGroupFile01"
                />
              </div>
              <p className="text-center">OR</p>
              <div className="form-floating">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-control"
                  id="floatingInput"
                  placeholder=""
                />
                <label htmlFor="floatingInput">
                  Paste Url(if u don't have in gallery)
                </label>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <div className="main_product_image">
                {image ? (
                  <img src={image} alt="Main Product" />
                ) : (
                  <MessageBox variant="danger">No Image Added</MessageBox>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <label className="input-group-text" htmlFor="inputGroupFile01">
                  Additional Images (Maximum 5)
                </label>
                <input
                  onChange={(e) => uploadFileHandler(e, true)}
                  accept="image/*"
                  type="file"
                  className="form-control"
                  id="inputGroupFile01"
                />
              </div>
              <p className="text-center">OR</p>
              <div className="input-group mb-3">
                <input
                  type="text"
                  value={imagesUrl}
                  onChange={(e) => setImagesUrl([e.target.value])}
                  className="form-control"
                  placeholder="Additional Images Url"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <button
                  onClick={handlePushClick}
                  className="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                >
                  Click to insert
                </button>
              </div>
            </div>
            <div
              className="col-12 col-md-6 d-flex flex-wrap justify-content-start align-items-center
             small_product_images_div mb-2"
            >
              {images.length === 0 ? (
                <MessageBox variant="danger">No Additional Images</MessageBox>
              ) : (
                images.map((x, index) => (
                  <div key={index} className="small_product_images">
                    <img
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      key={x}
                      src={x}
                      alt="More Product"
                    />
                    <button
                      type="button"
                      onClick={() => deleteFileHandler(x)}
                      className="btn btn-sm btn-danger"
                    >
                      <i className="fa fa-close"></i>
                    </button>
                  </div>
                ))
              )}
              {loadingUpload && <Spinner></Spinner>}
            </div>
          </div>
          <div className="row px-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={topRated}
                onChange={(e) => setTopRated(e.target.checked)}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Product of the Month
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="submit"
                disabled={loadingCreate}
                className="btn btn-primary w-100 mt-2"
              >
                {loadingCreate ? <Spinner></Spinner> : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
