import Admin from "../models/Admin.js";
import Appointment from "../models/Appointment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all appointments
export const viewAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization")
      .populate("patient", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
