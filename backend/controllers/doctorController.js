import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a doctor
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor)
      return res.status(400).json({ message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialization,
    });
    await doctor.save();

    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update doctor status
export const updateDoctorStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Acknowledge appointment
export const acknowledgeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctor: req.user.id },
      { doctorAcknowledged: true, status: "Completed" },
      { new: true }
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found or not assigned to you" });
    }
    res.json({ message: "Appointment acknowledged", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
