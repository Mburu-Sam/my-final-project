import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    symptoms: { type: String },
    doctorAcknowledged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
