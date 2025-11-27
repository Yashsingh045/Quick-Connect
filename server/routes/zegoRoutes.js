import express from 'express';
import { 
  getZegoConfig, 
  getZegoTokenForRoom, 
  getRoomParticipants 
} from '../controllers/zegoController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get Zego configuration (public)
router.get('/config', getZegoConfig);

// Get token for a specific room (requires authentication)
router.get('/token/:roomID', authenticate, getZegoTokenForRoom);

// Get participants in a room (public, but rate limit in production)
router.get('/room/:roomID/participants', getRoomParticipants);

export default router;

