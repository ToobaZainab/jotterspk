import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Announcement from "../models/announcementModel.js";

const announcementRouter = express.Router();

announcementRouter.get("/", async (req, res) => {
  const announcements = await Announcement.find();
  res.send(announcements);
});

announcementRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newAnnouncement = new Announcement({
      title: req.body.title,
    });
    const announcement = await newAnnouncement.save();
    res.send({ message: "Announcement Created", announcement });
  })
);

announcementRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if (announcement) {
      await announcement.remove();
      res.send({ message: "Announcement Deleted" });
    } else {
      res.status(404).send({ message: "Announcement Not Found" });
    }
  })
);

export default announcementRouter;
