import express from "express";
import {
  registerPatient,
  loginPatient,
  updatePatientStatus,
  getAllPatients,
} from "../controllers/patientController.js";

const router = express.Router();

// Public routes
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// Admin routes
router.put("/update-status", updatePatientStatus);
router.get("/", getAllPatients);

export default router;
