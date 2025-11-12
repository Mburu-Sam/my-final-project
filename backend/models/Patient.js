import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    disease: { type: String },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    status: {
      type: String,
      enum: ["Pending", "Admitted", "Discharged"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
