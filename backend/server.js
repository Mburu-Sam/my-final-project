import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
