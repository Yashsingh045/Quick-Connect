// server/services/otpServices.js
import redisClient from '../config/redis.js';
import { generateOTP } from '../utils/generateOtp.js';
import { sendEmail } from '../utils/emailService.js';

const OTP_EXPIRY = 600; // 10 minutes in seconds

export const createAndSendOTP = async (email, purpose = 'registration') => {
  try {
    const otp = generateOTP();
    const key = `otp:${email}:${purpose}`;
    
    // Store OTP in Redis with expiration
    await redisClient.setEx(key, OTP_EXPIRY, otp);
    
    // Send OTP via email
    const emailSent = await sendEmail(
      email,
      'Your Verification Code',
      `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`
    );
    
    if (!emailSent) {
      console.error('Failed to send OTP email');
      return { success: false, error: 'Failed to send OTP email' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in createAndSendOTP:', error);
    return { 
      success: false, 
      error: 'Failed to process OTP request' 
    };
  }
};

export const verifyOTPService = async (email, otp, purpose = 'registration') => {
  try {
    
    const key = `otp:${email}:${purpose}`;
    const storedOTP = await redisClient.get(key);
    
    if (!storedOTP) {
      return { 
        success: false, 
        error: 'OTP not found or expired' 
      };
    }
    
    console.log('Stored OTP:', storedOTP, 'Received OTP:', otp);
    if (storedOTP !== otp) {
      return { 
        success: false, 
        error: 'Invalid OTP' 
      };
    }
    
    // Don't delete the OTP here, let the registration handler do it after successful registration
    return { 
      success: true,
      data: { email }
    };
  } catch (error) {
    console.error('Error in verifyOTPService:', error);
    return { 
      success: false, 
      error: 'Failed to verify OTP' 
    };
  }
};

export const deleteOTP = async (email, purpose = 'registration') => {
  try {
    const key = `otp:${email}:${purpose}`;
    await redisClient.del(key);
    return { success: true };
  } catch (error) {
    console.error('Error deleting OTP:', error);
    return { 
      success: false, 
      error: 'Failed to delete OTP' 
    };
  }
};