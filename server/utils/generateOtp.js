// /server/utils/generateOtp.js
import crypto from 'crypto';

// Generate a secure 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};