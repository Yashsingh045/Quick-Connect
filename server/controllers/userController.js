import dotenv from 'dotenv';
import prisma from '../config/config.js';
import bcrypt from 'bcryptjs';
import { generateTokens, verifyToken } from '../utils/jwt.js';
import { createAndSendOTP, verifyOTPService, deleteOTP } from '../services/otpServices.js';

dotenv.config();

// Request OTP for password reset or verification
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if user exists (for password reset)
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // This will generate, store, and send the OTP in one go
    const { success, error } = await createAndSendOTP(email);
    
    if (!success) {
      console.error('Failed to send OTP:', error);
      return res.status(500).json({ 
        success: false, 
        message: error || 'Failed to send OTP. Please try again.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error in requestOTP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { success, error } = await verifyOTPService(email, otp);
    
    if (!success) {
      return res.status(400).json({ 
        success: false, 
        message: error || 'Invalid or expired OTP' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error in verifyOTP controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};

// Register a new user

// server/controllers/userController.js
export const createUser = async (req, res) => {
  try {
    const { email, name, password, otp } = req.body;

    // Input validation
    if (!email || !name || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Verify OTP first
    const otpVerification = await verifyOTPService(email, otp);
    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.error || 'Invalid or expired OTP'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database with error handling
    let user;
    try {
      user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          userName: name,
          emailVerified: true,
        }
      });
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user in database',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email
    });

    // Omit sensitive data from the response
    const { password: _, ...userData } = user;

    // Delete the used OTP
    try {
      await deleteOTP(email);
    } catch (otpError) {
      console.error('Error deleting OTP after registration:', otpError);
      // Don't fail the registration if OTP deletion fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        tokens: { accessToken, refreshToken }
      }
    });

  } catch (error) {
    console.error('Error in registerUser controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password both are required"
      });
    }

    const emailLower = email.toLowerCase().trim();
    console.log('Searching for user with email:', emailLower);

    const user = await prisma.users.findFirst({
      where: {
        email: {
          equals: emailLower,
          mode: 'insensitive'
        }
      }
    });

    console.log('User found:', user ? 'Yes' : 'No');
  


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT tokens with required user data
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email
    });

    // Update user's refresh token in database
    await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Remove sensitive data from user object
    const { password: _, refreshToken: rt, ...userWithoutSensitiveData } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutSensitiveData,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred during login',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await prisma.users.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpiry: {
          gt: new Date() // Check if token is not expired
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};



export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }

    const { token, expiresAt } = generatePasswordResetToken();
    
    await prisma.users.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiresAt
      }
    });

    await sendPasswordResetEmail(user, token);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};



// Refresh access token using refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Find the user
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        is_verified: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Check if token is not expired
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        refreshToken: null // Invalidate all refresh tokens
      }
    });
   res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};




// In userController.js
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};