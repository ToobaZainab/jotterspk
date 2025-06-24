import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      images: req.body.images,
      colors: req.body.colors,
      price: req.body.price,
      topProduct: req.body.topProduct,
      offerPrice: req.body.offerPrice,
      size: req.body.size,
      category: req.body.category,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      sold: req.body.sold,
      rating: 0,
      numReviews: 0,
      description: req.body.description,
      highlights: req.body.highlights,
    });
    const product = await newProduct.save();
    res.send({ message: "Product Created", product });
  })
);

productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.offerPrice = req.body.offerPrice;
      product.image = req.body.image;
      product.topProduct = Boolean(req.body.topProduct);
      product.images = req.body.images;
      product.colors = req.body.colors;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.size = req.body.size;
      product.countInStock = req.body.countInStock;
      product.sold = req.body.sold;
      product.description = req.body.description;
      product.highlights = req.body.highlights;
      await product.save();
      res.send({ message: "Product Updated" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    const userId = req.user._id.toString();

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === userId
    );

    if (isReviewed) {
      return res
        .status(400)
        .send({ message: "You already submitted a review" });
    } else {
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    }
  })
);

const PAGE_SIZE = 10;

productRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.get("/reviews/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        errors: [
          {
            message: "Please enter correct Id",
            status: "404",
          },
        ],
      });
    }
  }
});

productRouter.delete("/reviews/:id/:productId", async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (product) {
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.params.id.toString()
    );
    let numReviews = reviews.length;
    let rating = 0;
    if (reviews.length === 0) {
      rating = 0;
    } else {
      rating = reviews.reduce((a, c) => c.rating + a, 0) / reviews.length;
    }
    await Product.findByIdAndUpdate(req.params.productId, {
      reviews,
      numReviews,
      rating,
    });
    res.send({ message: "Product Rviews Updated" });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default productRouter;
