import { generateZegoTokenForMeeting } from '../utils/zegoToken.js';

/**
 * Get Zego configuration with token for authenticated user
 * This endpoint generates a secure token instead of exposing AppSign
 */
export const getZegoConfig = async (req, res) => {
    try {
        const appID = process.env.ZEGO_APP_ID;
        const appSign = process.env.ZEGO_APP_SIGN;

        if (!appID || !appSign) {
            return res.status(500).json({
                success: false,
                message: 'Zego configuration missing on server',
                error: 'ZEGO_APP_ID or ZEGO_APP_SIGN not found in .env'
            });
        }

        // Get user ID from authenticated request (set by auth middleware)
        let userID = req.user?.id;
        
        // Ensure userID is a primitive value, not an object
        if (userID && typeof userID === 'object') {
            userID = userID.userId || userID.id;
        }
        
        if (!userID) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Convert to string and ensure it's a valid user ID
        const userIDString = String(userID);
        
        // Generate secure token for the user
        const tokenData = generateZegoTokenForMeeting(
            userIDString,
            null, // roomID can be set when joining a specific room
            3600  // Token valid for 1 hour
        );

        res.status(200).json({
            success: true,
            data: {
                appID: tokenData.appID,
                token: tokenData.token
            }
        });
    } catch (error) {
        console.error('Error generating Zego config:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error generating Zego configuration', 
            error: error.message 
        });
    }
};

/**
 * Generate Zego token for a specific meeting room
 * This allows for room-specific token generation
 */
export const getZegoTokenForRoom = async (req, res) => {
    try {
        const { roomID } = req.params;
        const appID = process.env.ZEGO_APP_ID;
        const appSign = process.env.ZEGO_APP_SIGN;

        if (!appID || !appSign) {
            return res.status(500).json({
                success: false,
                message: 'Zego configuration missing on server',
                error: 'ZEGO_APP_ID or ZEGO_APP_SIGN not found in .env'
            });
        }

        // Get user ID from authenticated request
        let userID = req.user?.id;
        
        // Ensure userID is a primitive value, not an object
        if (userID && typeof userID === 'object') {
            userID = userID.userId || userID.id;
        }
        
        if (!userID) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roomID) {
            return res.status(400).json({
                success: false,
                message: 'Room ID is required'
            });
        }

        // Convert to string and ensure it's a valid user ID
        const userIDString = String(userID);

        // Generate secure token for the user and room
        const tokenData = generateZegoTokenForMeeting(
            userIDString,
            roomID,
            3600  // Token valid for 1 hour
        );

        res.status(200).json({
            success: true,
            data: {
                appID: tokenData.appID,
                token: tokenData.token,
                roomID: roomID
            }
        });
    } catch (error) {
        console.error('Error generating Zego token for room:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error generating Zego token', 
            error: error.message 
        });
    }
};
