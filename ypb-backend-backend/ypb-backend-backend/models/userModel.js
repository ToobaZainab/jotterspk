import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    resetToken: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    isReseller: { type: Boolean, default: false, required: true },
    totalBalance: { type: Number, default: 0 },
    processingTransaction: { type: Number, default: 0 },
    totalWithdraw: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
