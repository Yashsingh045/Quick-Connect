import express from 'express';
import { getZegoConfig, getZegoTokenForRoom } from '../controllers/zegoController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protect Zego routes with authentication
// Get Zego config with token (requires authentication)
router.get('/config', authenticate, getZegoConfig);

// Get token for a specific room (requires authentication)
router.get('/token/:roomID', authenticate, getZegoTokenForRoom);

export default router;
