import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { isAuth, isAdmin, generateToken, baseUrl } from "../utils.js";
import { sendMail } from "../sendMail.js";
import Token from "../models/token.js";
import crypto from "crypto";
import mongoose from "mongoose";

const userRouter = express.Router();

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/profile/withdraw/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.get(
  "/mine/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId.toString();
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({
          message:
            "User Not Found or your account has been terminated by Admin",
        });
      }
    } else {
      res.status(404).send({ message: "Please provide correct id" });
    }
  })
);

userRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isReseller: updatedUser.isReseller,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.post(
  "/forget-password",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      user.resetToken = token;
      await user.save();

      await sendMail({
        email: user.email,
        subject: "Reset Password Request",
        message: `
Hi, ${user.name}!

Please Click the following link to reset your password:


${baseUrl()}/reset-password/${token}


Regards: 
        YourProfitBazar & Team
        Happy Shopping!
    `,
      });

      res.send({ message: "We sent reset password link to your email." });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();

            sendMail({
              email: user.email,
              subject: "Password Reset Successfully",
              message: `
      Hi, ${user.name}!
      
Your Password has been reset successfully. If it was not you who changed your password, please contact us as soon as possible.
      
Regards:
        YourProfitBazar & Team
        Happy Shopping!
          `,
            });

            res.send({
              message: "Password reset successfully",
            });
          }
        } else {
          res.status(404).send({ message: "User not found" });
        }
      }
    });
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (
        user.email === "admin@gmail.com" ||
        user.email === "aneebshahid535@gmail.com"
      ) {
        res.status(400).send({ message: "Can Not Update Owner" });
        return;
      }
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.totalBalance = req.body.totalBalance || user.totalBalance;
      user.processingTransaction =
        req.body.processingTransaction || user.processingTransaction;
      user.totalWithdraw = req.body.totalWithdraw || user.totalWithdraw;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isReseller = Boolean(req.body.isReseller);
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (
        user.email === "admin@gmail.com" ||
        user.email === "aneebshahid535@gmail.com"
      ) {
        res.status(400).send({ message: "Can Not Delete Owner" });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.post(
  "/becomereseller",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email" });
    }
    if (user) {
      await sendMail({
        email: "aneebshahid535@gmail.com",
        subject: "Become a Reseller",
        message: `
  Hi Admin, My name is ${req.body.name}!
  My user Id is # ${req.body.userId}.
  My email is ${req.body.email}.
  My phone number is ${req.body.phone}.
  Student : ${req.body.profession}.
  I heard about your site from ${req.body.heard}.
  My message is ${req.body.message}.
  
  Please approve my request to become a reseller of Your Profit Bazar.
  
  Regards:
  YourProfitBazar & Team
  Happy Shopping!
    `,
      });

     await sendMail({
        email: user.email,
        subject: "Reseller Request",
        message: `
We have recieved your request to become a reseller with following information:
Hi Admin, My name is ${req.body.name}!
My email is ${req.body.email}.
My phone number is ${req.body.phone}.
Are you a Student : ${req.body.profession}.
I heard about your site from ${req.body.heard}.
My message is ${req.body.message}.
  
In case you have provided wrong information please contact us as soon as possible.
Otherwise your account may be terminated or you will face other consequences.
Your request will be processed in 2-3 working days. If your request is not processed during 
2-3 working days you can contact us on whatsApp.
  
  Regards:
  YourProfitBazar & Team
  Happy Shopping!
    `,
      });
    }
    return res.status(200).send({ message: "Reseller Request sent successfully" });
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email" });
    }
    if (user) {
      let validPassword = bcrypt.compareSync(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).send({ message: "Invalid Password" });
      }
      if (validPassword && user.verified === true) {
        const token = await Token.findOne({
          userId: user._id,
        });
        if (token) {
          await Token.findOneAndDelete(token);
        }

        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isReseller: user.isReseller,
          token: generateToken(user),
          verified: user.verified,
        });
        return;
      }
      if (user.verified !== true) {
        let existingToken = await Token.findOne({ userId: user._id });
        if (existingToken) {
          return res.status(401).send({
            message:
              "Please verify your email. We have already sent mail to your account.Please check your inbox or spam folder.",
          });
        }
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${baseUrl()}/verify/${user._id}/${token.token}`;

        await sendMail({
          email: user.email,
          subject: "Verify your email",
          message: `
    Hi, ${user.name}!
    
    Please click on this link to verify your email address.
    
    ${url}
    
    Regards:
    YourProfitBazar & Team
    Happy Shopping!
      `,
        });
        return res.status(401).send({
          message: "We sent an email to your account, please verify",
        });
      }
    }
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    let existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(401)
        .send({ message: "User with this email already exists" });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${baseUrl()}/verify/${user._id}/${token.token}`;

    await sendMail({
      email: user.email,
      subject: "Verify your email",
      message: `
Hi, ${user.name}!

Please click on this Link to verify your email address.

${url}

Regards:
YourProfitBazar & Team
Happy Shopping!
  `,
    });

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isReseller: user.isReseller,
      token: generateToken(user),
      verified: user.verified,
    });
  })
);

userRouter.get(
  "/verify/:id/:token",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (!user) {
        return res.status(400).send({ message: "Invalid link" });
      }
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token.toString(),
      });
      if (!token) {
        return res.status(400).send({ message: "Invalid Token" });
      }
      await User.findByIdAndUpdate(req.params.id, { verified: true });
      return res.status(200).send({ message: "Email verified successfully" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  })
);

export default userRouter;
