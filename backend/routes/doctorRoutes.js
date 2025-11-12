import express from "express";
import {
  registerDoctor,
  acknowledgeAppointment,
  loginDoctor,
  getAllDoctors,
  updateDoctorStatus,
} from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/acknowledge-appointment", protect, acknowledgeAppointment);
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/", protect, getAllDoctors);
router.put("/:id/status", protect, updateDoctorStatus);

export default router;
