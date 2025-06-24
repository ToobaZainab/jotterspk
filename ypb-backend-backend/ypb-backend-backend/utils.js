import jwt from "jsonwebtoken";
import { sendMail } from "./sendMail.js";
import Token from "./models/token.js";
import crypto from "crypto";

export const baseUrl = () => "https://ypb-frontend.vercel.app";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isVerified = async (req, res, next) => {
  const user = req.user;
  if (user && !user.verified) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${baseUrl()}/users/${user._id}/verify/${token.token}`;

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
    }
  }
  return res
    .status(400)
    .send({ message: "An email was sent to your account,please verify" });
};
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};
export const isReseller = (req, res, next) => {
  if (req.user && req.user.isReseller === true) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Reseller Token" });
  }
};
