import { Router } from "express";
import {
    createMeeting,
    deleteMeeting,
    readMeeting,
    updateMeeting,
    getRecentMeetings,
    validateRoomCode,
    createInstantMeeting
} from "../controllers/meetingController.js";
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.post("/", authenticate, createMeeting)
router.post("/instant", authenticate, createInstantMeeting)
router.get("/", authenticate, readMeeting)
router.get("/recent", authenticate, getRecentMeetings)
router.get("/validate/:roomID", validateRoomCode)
router.get("/:meetingId", authenticate, readMeeting)
router.put("/:meetingId", authenticate, updateMeeting)
router.delete("/:meetingId", authenticate, deleteMeeting)



export default router;
