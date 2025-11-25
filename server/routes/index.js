import { Router } from "express";
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import meetingRoutes from './meetingRoutes.js';
import zegoRoutes from './zegoRoutes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes); // This will be /api/auth
router.use('/users', userRoutes); // This will be /api/users
router.use('/meetings', meetingRoutes); // This will be /api/meetings
router.use('/zego', zegoRoutes); // This will be /api/zego

export default router;
