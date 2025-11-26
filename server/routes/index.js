import { Router } from "express";
import userRoutes from "./userRoutes.js";
import meetingRoutes from "./meetingRoutes.js";
import authRoutes from "./authRoutes.js";

const routes = Router();

// Mount routes
routes.use("/auth", authRoutes);  // This will be /api/auth
routes.use("/user", userRoutes);  // This will be /api/user
routes.use("/meeting", meetingRoutes);  // This will be /api/meeting

export default routes;