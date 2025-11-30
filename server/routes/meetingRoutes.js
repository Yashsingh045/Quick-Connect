import { Router } from "express";
import { createMeeting, deleteMeeting, readMeeting, updateMeeting, getRecentMeetings } from "../controllers/meetingController.js";
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.post("/", authenticate, createMeeting)
router.get("/", authenticate, readMeeting)
router.get("/recent", authenticate, getRecentMeetings)
router.get("/:meetingId", authenticate, readMeeting)
router.put("/:meetingId", authenticate, updateMeeting)
router.delete("/:meetingId", authenticate, deleteMeeting)



export default router;
