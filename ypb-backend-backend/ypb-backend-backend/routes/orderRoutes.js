import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from "../utils.js";
import { sendMail } from "../sendMail.js";
import crypto from "crypto";

const orderRouter = express.Router();

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      resellerName: req.body.resellerName,
      resellerProfit: req.body.resellerProfit,
      user: req.user._id,
    });

    const order = await newOrder.save();
    sendMail({
      email: order.shippingAddress.email,
      subject: "Thank You for placing your order",
      message: `
Hi, ${order.shippingAddress.fullName}!
Your Order id is # ${order._id}.
Your order will be delivered to you in 3-4 working days.

Product(s) included in the order:
${order.orderItems.map((item) => item.name)}

Shipping Details:
Name: ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.address}
City: ${order.shippingAddress.city}
Phone: ${order.shippingAddress.mobile}

Price Calculations:
Items Price: ${order.itemsPrice}
Shipping Charges: ${order.shippingPrice}
________________________________
Total Amount: ${order.totalPrice}

Payment Method: ${order.paymentMethod}

Need Any Help?

To check your order status, go to your Account > Order History.
We are only using cash on delivery payments due to customers opinion.
According to customers opinion we will soon launch onilne payments.

Order not delivered yet?
Please contact us on our email 'yourprofitbazar@gmail.com'.
Or directly reach to us on our whatsApp '+92 3146134122'.
      
How to cancel your order?
You can cancel your order if order status is pending.
Go to your Account > Order History > Order Details and cancel you order if you want.
After the order is shipped you can not cancel your order.

Regards: 
        YourProfitBazar & Team
        Happy Shopping!
`,
    });

    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
        },
      },
    ]);
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories, products });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/status",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.orderStatus;
      if (order && order.orderStatus === "Delivered") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
        const user = await User.findById(order.user._id);
        if (user.isReseller === true && order.resellerProfit > 0) {
          let totalBalance = user.totalBalance;

          await User.findByIdAndUpdate(
            order.user._id,
            {
              totalBalance: totalBalance + order.resellerProfit,
            },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
        }
      }
      sendMail({
        email: order.shippingAddress.email,
        subject: `Your Order has been ${order.orderStatus}`,
        message: `
        Hi, ${order.shippingAddress.fullName}!
        Your Order with id number #${order._id} has been ${order.orderStatus}.
        
        Product(s) included in the order:
        ${order.orderItems.map((item) => item.name)}
        
        Shipping Details:
        Name: ${order.shippingAddress.fullName}
        Address: ${order.shippingAddress.address}
        City: ${order.shippingAddress.city}
        Phone: ${order.shippingAddress.mobile}
        
        Payment Method: ${order.paymentMethod}
        
        Price Calculations:
        Items Price: ${order.itemsPrice}
        Shipping Charges: ${order.shippingPrice}
        ________________________________
        Total Amount: ${order.totalPrice}
        
        Need Any Help?
        
        To check your order status, go to your Account > Order History.
        We are only using cash on delivery payments due to customers opinion.
        According to customers opinion we will soon launch onilne payments.
        
        Order not delivered yet?
        Please contact us on our email 'yourprofitbazar@gmail.com'.
        Or directly reach to us on our whatsApp '+92 3146134122'.
        
        How to return your order?
        You can return your order if the product is damaged or changed(Video proof required).
        To return your order contact us on whatsApp +923146134122
        
        Regards:
                YourProfitBazar & Team
                Happy Shopping!
          `,
      });
      const updatedOrder = await order.save();
      res.send({ message: "Status Updated", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.countInStock -= quantity;
  product.sold += quantity;

  await product.save({ validateBeforeSave: false });
}

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: "Order Deleted" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.post("/init", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const txnRefNo = `T${Date.now()}`;
    const txnAmount = parseFloat(amount) * 100; // JazzCash uses paisa

    const payload = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: txnAmount,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: getFormattedDate(),
      pp_BillReference: "billRef",
      pp_Description: "Order payment",
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
      ppmpf_1: orderId,
    };
    console.log("JazzCash Payload:", payload);

    // Hash generation
    const secureHash = createSecureHash(payload);
    payload.pp_SecureHash = secureHash;

    // Send the payload to frontend (not to JazzCash)
    res.json({
      actionUrl: process.env.JAZZCASH_SANDBOX_API,
      fields: payload,
    });
  } catch (error) {
    console.error("JazzCash Init Error:", error);
    res.status(500).json({ error: "JazzCash Payment Init Failed" });
  }
});

// Helper: Generate formatted date in YYYYMMDDHHMMSS
function getFormattedDate() {
  const date = new Date();
  return date
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

function createSecureHash(data) {
  const sortedKeys = Object.keys(data).sort();
  const sortedString = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");

  const hmac = crypto.createHmac("sha256", process.env.JAZZCASH_INTEGRITY_SALT);
  hmac.update(sortedString);
  return hmac.digest("hex").toUpperCase(); // Uppercase hash is required by JazzCash
}

// In your orderRoutes.js or similar file
orderRouter.post("/payment/verify", async (req, res) => {
  try {
    const { txnRefNo, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    // Optionally save transaction ID
    order.paymentResult = {
      id: txnRefNo,
      status: "JazzCash",
      update_time: new Date().toISOString(),
    };

    await order.save();

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Order update failed:", error);
    res.status(500).json({ message: "Order update failed" });
  }
});

orderRouter.post("/return", async (req, res) => {
  try {
    const { pp_ResponseCode, pp_TxnRefNo, pp_Amount } = req.body;
    const orderId = req.body.ppmpf_1;

    // Redirect to frontend with GET
    return res.redirect(
      `${process.env.FRONT_URL}/paymentsuccess?pp_ResponseCode=${pp_ResponseCode}&pp_TxnRefNo=${pp_TxnRefNo}&pp_Amount=${pp_Amount}&orderId=${orderId}`
    );
  } catch (error) {
    console.error("JazzCash return failed", error);
    return res.redirect(
      `${process.env.FRONT_URL}/paymentsuccess?pp_ResponseCode=999`
    );
  }
});

export default orderRouter;
