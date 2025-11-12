import Patient from "../models/Patient.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Patient registration (requires admin approval)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, gender, age } = req.body;

    const existingUser = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      gender,
      age,
    });

    res.status(201).json({
      message: "Registration successful, awaiting admin approval",
      patientId: user._id,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient login (only after approval)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Patient.findOne({ email }).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status !== "Approved")
      return res.status(401).json({ message: "Account not approved by admin" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      assignedDoctor: user.assignedDoctor,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves or rejects user
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status, doctorId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    if (doctorId) user.assignedDoctor = doctorId;
    await user.save();

    res.json({ message: `User ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate(
      "assignedDoctor",
      "name specialization phone"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
