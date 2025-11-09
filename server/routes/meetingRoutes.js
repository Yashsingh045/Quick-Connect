import { Router } from "express";
import { createMeeting, deleteMeeting, readMeeting, updateMeeting } from "../controllers/meetingController.js";


const router = Router();


router.post("/", createMeeting)
router.get("/", readMeeting)
router.get("/:meetingId", readMeeting)
router.put("/:meetingId", updateMeeting)
router.delete("/:meetingId", deleteMeeting)



export default router;