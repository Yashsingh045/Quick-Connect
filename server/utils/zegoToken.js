import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate Zego token for video conferencing
 * @param {number} appID - Zego App ID
 * @param {string} appSign - Zego App Sign
 * @param {string} userID - User ID
 * @param {number} effectiveTimeInSeconds - Token validity in seconds (default: 3600 = 1 hour)
 * @returns {string} - Generated token
 */
export const generateZegoToken = (appID, appSign, userID, effectiveTimeInSeconds = 3600) => {
  try {
    if (!appID || !appSign || !userID) {
      throw new Error('appID, appSign, and userID are required');
    }

    // Calculate expiration timestamp
    const now = Math.floor(Date.now() / 1000);
    const expire = now + effectiveTimeInSeconds;

    // Create payload
    const payload = {
      app_id: parseInt(appID, 10),
      user_id: String(userID),
      nonce: Math.floor(Math.random() * 2147483647),
      ctime: now,
      expire: expire,
      payload: ''
    };

    // Convert payload to JSON string
    const payloadStr = JSON.stringify(payload);

    // Create HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', Buffer.from(appSign, 'hex'))
      .update(payloadStr)
      .digest('hex');

    // Encode payload and signature to base64
    const token = Buffer.from(
      JSON.stringify({
        ...payload,
        signature
      })
    ).toString('base64');

    return token;
  } catch (error) {
    console.error('Error generating Zego token:', error);
    throw error;
  }
};

/**
 * Generate Zego token for a meeting room
 * @param {string} userID - User ID
 * @param {string} roomID - Room/Conference ID
 * @param {number} effectiveTimeInSeconds - Token validity in seconds
 * @returns {object} - Object containing appID and token
 */
export const generateZegoTokenForMeeting = (userID, roomID, effectiveTimeInSeconds = 3600) => {
  const appID = process.env.ZEGO_APP_ID;
  const appSign = process.env.ZEGO_APP_SIGN;

  if (!appID || !appSign) {
    throw new Error('ZEGO_APP_ID or ZEGO_APP_SIGN not configured');
  }

  const token = generateZegoToken(appID, appSign, userID, effectiveTimeInSeconds);

  return {
    appID: parseInt(appID, 10),
    token,
    roomID: roomID || null
  };
};

