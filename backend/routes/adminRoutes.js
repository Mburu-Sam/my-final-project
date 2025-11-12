import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerAdmin,
  loginAdmin,
  viewAllAppointments,
  updateAppointmentStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/appointments", protect, viewAllAppointments);
router.put("/appointments/status", protect, updateAppointmentStatus);

export default router;
