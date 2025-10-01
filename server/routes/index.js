import { Router } from "express";
import userRoutes from "./userRoutes.js";
import meetingRoutes from "./meetingRoutes.js";


const routes = Router();

routes.use("/api/user", userRoutes);
routes.use("/api/meeting", meetingRoutes);

export default routes;