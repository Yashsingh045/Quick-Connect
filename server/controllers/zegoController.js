import { generateZegoTokenForMeeting } from '../utils/zegoToken.js';

/**
 * Get Zego configuration
 * Matches the mobile app expectation of { appID, appSign }
 */
export const getZegoConfig = async (req, res) => {
    try {
        const appID = process.env.ZEGO_APP_ID;
        const appSign = process.env.ZEGO_APP_SIGN;

        if (!appID || !appSign) {
            console.error('Zego env vars missing');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                error: 'ZEGO_APP_ID or ZEGO_APP_SIGN not found'
            });
        }

        // Return AppID and AppSign directly so the UI Kit can use them
        res.status(200).json({
            success: true,
            data: {
                appID: parseInt(appID),
                appSign: appSign
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
 * Get Zego configuration for a specific room
 */
export const getZegoTokenForRoom = async (req, res) => {
    try {
        const appID = process.env.ZEGO_APP_ID;
        const appSign = process.env.ZEGO_APP_SIGN;
        const { roomID } = req.params;

        if (!appID || !appSign) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        // Return AppID and AppSign directly
        res.status(200).json({
            success: true,
            data: {
                appID: parseInt(appID),
                appSign: appSign,
                roomID
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