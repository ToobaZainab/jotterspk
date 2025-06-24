import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Banner from "./../models/bannerModel.js";

const bannerRouter = express.Router();

bannerRouter.get("/", async (req, res) => {
  const banners = await Banner.find();
  res.send(banners);
});

bannerRouter.put("/order", async (req, res) => {
  try {
    const newBanners = req.body.newbanners;
    await Banner.deleteMany({});
    const result = await Banner.insertMany(newBanners);
    res.status(200).json({ message: "Banners updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

bannerRouter.get("/:id", async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    res.send(banner);
  } else {
    res.status(404).send({ message: "Banner Not Found" });
  }
});

bannerRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newBanner = new Banner({
      name: req.body.name,
      image: req.body.image,
      link: req.body.link,
      description: req.body.description,
    });
    const banner = await newBanner.save();
    res.send({ message: "Banner Announcement Created", banner });
  })
);

bannerRouter.put(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newBanner = new Banner({
      name: req.body.name,
      image: req.body.image,
      link: req.body.link,
      description: req.body.description,
    });
    const banner = await newBanner.save();
    res.send({ message: "Banner Announcement Created", banner });
  })
);

bannerRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    if (banner) {
      banner.name = req.body.name;
      banner.link = req.body.link;
      banner.description = req.body.description;
      banner.image = req.body.image;
      await banner.save();
      res.send({ message: "Banner Updated" });
    } else {
      res.status(404).send({ message: "Banner Not Found" });
    }
  })
);

bannerRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await banner.remove();
      res.send({ message: "Banner Deleted" });
    } else {
      res.status(404).send({ message: "Banner Not Found" });
    }
  })
);

export default bannerRouter;
