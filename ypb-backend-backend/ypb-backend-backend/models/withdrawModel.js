import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    withdrawAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isCancelled: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);
export default Withdraw;
