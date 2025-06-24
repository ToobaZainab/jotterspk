import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Withdraw from "../models/withdrawModel.js";
import User from "../models/userModel.js";
import { sendMail } from "../sendMail.js";

const withdrawRouter = express.Router();

withdrawRouter.get("/", isAuth, isAdmin, async (req, res) => {
  const withdraws = await Withdraw.find().populate("user", "name");
  res.send(withdraws);
});

withdrawRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const withdraw = await Withdraw.findById(req.params.id);
    if (withdraw) {
      res.send(withdraw);
    } else {
      res.status(404).send({ message: "Withdarw Not Found" });
    }
  })
);
withdrawRouter.get(
  "/mine/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const withdraws = await Withdraw.find({ user: req.params.userId });
    res.send(withdraws);
  })
);

withdrawRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newWithdraw = new Withdraw({
      bankName: req.body.bankName,
      accountNumber: req.body.accountNumber,
      accountName: req.body.accountName,
      withdrawAmount: req.body.withdrawAmount,
      user: req.user._id,
    });
    const user = await User.findById(req.user._id);
    let totalBalance = user.totalBalance;
    let processingTransaction = user.processingTransaction;

    await User.findByIdAndUpdate(
      req.user._id,
      {
        totalBalance: totalBalance - req.body.withdrawAmount,
        processingTransaction: processingTransaction + req.body.withdrawAmount,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    sendMail({
      email: user.email,
      subject: "Reseller Withdraw Request",
      message: `
Hi, ${user.name}!

We have recieved your withdraw request.
Your request will be processed within 3-4 working days.


Regards: 
      YourProfitBazar & Team
      Happy Shopping!
  `,
    });

    const withdraw = await newWithdraw.save();
    res.send({ message: "New Withdraw Created", withdraw });
  })
);

withdrawRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const withdraw = await Withdraw.findById(req.params.id);
    if (withdraw) {
      await withdraw.remove();
      res.send({ message: "Withdraw Deleted" });
    } else {
      res.status(404).send({ message: "Withdraw Not Found" });
    }
  })
);

withdrawRouter.put(
  "/:id/pay",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const withdraw = await Withdraw.findById(req.params.id);
    if (withdraw) {
      withdraw.isPaid = true;
      withdraw.paidAt = Date.now();
      const user = await User.findById(withdraw.user);
      let processingTransaction = user.processingTransaction;
      let totalWithdraw = user.totalWithdraw;

      await User.findByIdAndUpdate(
        withdraw.user,
        {
          processingTransaction: 0,
          totalWithdraw: totalWithdraw + withdraw.withdrawAmount,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      sendMail({
        email: user.email,
        subject: "Reseller Withdraw Approved",
        message: `
  Hi, ${user.name}!
  
  Your withdraw request has been approved successfully.
  Please check if you have recieved your amount.
  In case of any issue, do not hesitate to contact us.
  
  
  Regards: 
        YourProfitBazar & Team
        Happy Shopping!
    `,
      });
      await withdraw.save();
      res.send({ message: "Withdraw paid" });
    } else {
      res.status(404).send({ message: "Withdraw Not Found" });
    }
  })
);
withdrawRouter.put(
  "/:id/cancel",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const withdraw = await Withdraw.findById(req.params.id);
    if (withdraw) {
      withdraw.isCancelled = true;
      const user = await User.findById(withdraw.user);
      let processingTransaction = user.processingTransaction;
      let totalBalance = user.totalBalance;

      await User.findByIdAndUpdate(
        withdraw.user,
        {
          processingTransaction: 0,
          totalBalance: totalBalance + withdraw.withdrawAmount,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      sendMail({
        email: user.email,
        subject: "Reseller Withdraw Cancelled",
        message: `
  Hi, ${user.name}!
  
  Your withdraw request has been cancelled due to suspicious activity.
  We are sorry for inconvience. If you need any kind of Help please contact us.
  
  Regards: 
        YourProfitBazar & Team
        Happy Shopping!
    `,
      });
      await withdraw.save();
      res.send({ message: "Withdraw Cancelled" });
    } else {
      res.status(404).send({ message: "Withdraw Not Found" });
    }
  })
);

export default withdrawRouter;
