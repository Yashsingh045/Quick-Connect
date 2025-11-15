// server/utils/tokenUtils.js
import crypto from 'crypto';
import { addHours } from 'date-fns';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateEmailVerificationToken = () => ({
  token: generateToken(),
  expiresAt: addHours(new Date(), 24), // 24 hours from now
});

export const generatePasswordResetToken = () => ({
  token: generateToken(),
  expiresAt: addHours(new Date(), 1), // 1 hour from now
});