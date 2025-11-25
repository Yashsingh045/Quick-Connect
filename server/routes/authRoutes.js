// server/routes/authRoutes.js
import express from 'express';
import { 
  loginUser, 
  createUser, 
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/userController.js';
import { refreshTokenMiddleware } from '../middleware/auth.js';
import { createAndSendOTP, verifyOTPService } from '../services/otpServices.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/refresh-token', refreshTokenMiddleware, refreshToken);

// Email verification
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);


// Request OTP for registration
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    const result = await createAndSendOTP(email, 'registration');
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: result.error || 'Failed to send OTP' 
      });
    }
  } catch (error) {
    console.error('Error in request-otp:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

router.post('/register', createUser);

// Register a new user with OTP verification
// In server/routes/authRoutes.js
// router.post('/register', async (req, res) => {
//   try {
//     const { email, name, password, otp } = req.body;
//     console.log('Registration attempt:', { email, name, otp: !!otp, hasPassword: !!password });

//     // Input validation
//     if (!email || !name || !password || !otp) {
//       console.log('Missing fields:', { email: !!email, name: !!name, password: !!password, otp: !!otp });
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required',
//         missingFields: {
//           email: !email,
//           name: !name,
//           password: !password,
//           otp: !otp
//         }
//       });
//     }

//     // Verify OTP first
//     const otpVerification = await verifyOTPService(email, otp);
//     if (!otpVerification.success) {
//       console.log('OTP verification failed:', otpVerification.error);
//       return res.status(400).json({
//         success: false,
//         message: otpVerification.error || 'Invalid or expired OTP'
//       });
//     }

//     // Check if user already exists
//     const existingUser = await prisma.users.findUnique({ where: { email } });
//     if (existingUser) {
//       console.log('User already exists:', email);
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user in the database with error handling
//     let user;
//     try {
//       user = await prisma.users.create({
//         data: {
//           email,
//           password: hashedPassword,
//           name,
//           role: 'user',
//           is_verified: true
//         }
//       });
//       console.log('User created successfully:', user.id);
//     } catch (dbError) {
//       console.error('Database error during user creation:', {
//         error: dbError.message,
//         code: dbError.code,
//         meta: dbError.meta
//       });
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to create user in database',
//         error: process.env.NODE_ENV === 'development' ? {
//           message: dbError.message,
//           code: dbError.code,
//           meta: dbError.meta
//         } : undefined
//       });
//     }

//     // Rest of the code remains the same...
    
//   } catch (error) {
//     console.error('Registration route error:', {
//       message: error.message,
//       stack: error.stack,
//       ...error
//     });
//     res.status(500).json({
//       success: false,
//       message: 'Failed to register user',
//       error: process.env.NODE_ENV === 'development' ? {
//         message: error.message,
//         code: error.code,
//         meta: error.meta
//       } : undefined
//     });
//   }
// });


// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    const result = await verifyOTPService(email, otp);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'OTP verified successfully',
        data: result.data
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: result.error || 'Invalid or expired OTP' 
      });
    }
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during OTP verification' 
    });
  }
});


router.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json({ success: true, count: users.length });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;