import { Router } from "express";
import { createMeeting, deleteMeeting, readMeeting, updateMeeting } from "../controllers/meetingController.js";


const router = Router();


router.post("/", createMeeting)
router.delete("/", deleteMeeting)
router.put("/", updateMeeting)
router.get("/", readMeeting)



export default router;