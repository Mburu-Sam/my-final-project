import express from "express";
import {
  registerPatient,
  loginPatient,
  bookAppointment,
  viewAppointments,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/book-appointment", protect, bookAppointment);
router.get("/appointments", protect, viewAppointments);

export default router;
