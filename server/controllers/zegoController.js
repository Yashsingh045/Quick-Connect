import { generateZegoTokenForMeeting } from '../utils/zegoToken.js';

// In-memory store for active rooms and participants (in production, use Redis or similar)
const activeRooms = new Map();

/**
 * Get Zego configuration
 * Matches the mobile app expectation of { appID, appSign, serverUrl }
 */
export const getZegoConfig = async (req, res) => {
    try {
        const appID = process.env.ZEGO_APP_ID;
        const appSign = process.env.ZEGO_APP_SIGN;
        const serverUrl = process.env.ZEGO_SERVER_URL || 'wss://webliveroom-test.zego.im/ws'; // Default test server

        if (!appID || !appSign) {
            console.error('Zego env vars missing');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                error: 'ZEGO_APP_ID or ZEGO_APP_SIGN not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                appID: parseInt(appID),
                appSign: appSign,
                serverUrl: serverUrl
            }
        });
    } catch (error) {
        console.error('Get Zego Config Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get Zego config',
            error: error.message
        });
    }
};

/**
 * Get Zego token for a specific room with user information
 */
export const getZegoTokenForRoom = async (req, res) => {
    try {
        const appID = process.env.ZEGO_APP_ID;
        const appSign = process.env.ZEGO_APP_SIGN;
        const serverSecret = process.env.ZEGO_SERVER_SECRET;
        const { roomID } = req.params;
        // Generate a unique user ID to allow multiple logins from same account
        const dbUserId = req.user?.id;
        const userId = dbUserId ? `${dbUserId}_${Math.floor(Math.random() * 10000)}` : `user_${Math.floor(Math.random() * 10000)}`;
        const userName = req.user?.userName || req.user?.name || `User_${Math.random().toString(36).substr(2, 4)}`;

        if (!appID || !serverSecret) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                error: 'ZEGO_APP_ID or ZEGO_SERVER_SECRET not configured'
            });
        }

        if (!roomID) {
            return res.status(400).json({
                success: false,
                message: 'Room ID is required'
            });
        }
        console.log('Received token request for room:', roomID);  // Add this line

        // Generate a token for the user
        console.log('Generating token for room:', roomID);
        const tokenResult = generateZegoTokenForMeeting(
            userId,
            roomID,
            3600 // Token valid for 1 hour
        );
        const token = tokenResult.token;

        // Update room participants
        if (!activeRooms.has(roomID)) {
            activeRooms.set(roomID, new Set());
        }
        activeRooms.get(roomID).add(userId);

        console.log(`User ${userId} (${userName}) joining room ${roomID}. Total rooms: ${activeRooms.size}, Users in room: ${activeRooms.get(roomID).size}`);

        res.status(200).json({
            success: true,
            data: {
                appID: parseInt(appID),
                token: token,
                roomID: roomID,
                userID: userId,
                userName: userName,
                serverUrl: process.env.ZEGO_SERVER_URL || 'wss://webliveroom-test.zego.im/ws'
            }
        });
    } catch (error) {
        console.error('Get Zego Token Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get Zego token',
            error: error.message
        });
    }
};

/**
 * Get room participants
 */
export const getRoomParticipants = async (req, res) => {
    try {
        const { roomID } = req.params;

        if (!roomID) {
            return res.status(400).json({
                success: false,
                message: 'Room ID is required'
            });
        }

        const participants = activeRooms.get(roomID) || new Set();

        res.status(200).json({
            success: true,
            data: {
                roomID,
                participantCount: participants.size,
                participants: Array.from(participants)
            }
        });
    } catch (error) {
        console.error('Get Room Participants Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get room participants',
            error: error.message
        });
    }
};