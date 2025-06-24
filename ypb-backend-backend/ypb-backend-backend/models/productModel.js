import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    colors: [String],
    topProduct: { type: Boolean, default: false },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    highlights: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    size: { type: String },
    countInStock: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
