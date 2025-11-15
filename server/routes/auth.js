// server/routes/auth.js
import express from 'express';
import { 
  loginUser, 
  registerUser, 
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/userController.js';
import { refreshTokenMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshTokenMiddleware, refreshToken);

// Email verification
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;