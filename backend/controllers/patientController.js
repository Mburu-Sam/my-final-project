import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

// Register Patient
export const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, address, phone, email, password } = req.body;
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({
      name,
      age,
      gender,
      address,
      phone,
      email,
      password: hashedPassword,
    });
    await newPatient.save();
    res
      .status(201)
      .json({ message: "Patient registration submitted for approval" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient Login
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient || patient.status !== "Admitted") {
      return res
        .status(403)
        .json({ message: "Not approved or invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({ token, name: patient.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, symptoms } = req.body;
    const patientId = req.user.id;

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      symptoms,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment requested successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Appointments
export const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
