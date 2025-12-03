import api from './api';

/**
 * Fetch recent meetings for the logged-in user
 * @returns {Promise} - Promise with recent meetings data
 */
/**
 * Fetch meetings based on type
 * @param {string} type - 'past' or 'upcoming'
 * @returns {Promise} - Promise with meetings data
 */
export const getMeetingsByType = async (type = 'past') => {
    try {
        const response = await api.get(`/meetings/recent?type=${type}`);
        return {
            success: true,
            data: response.data.data || []
        };
    } catch (error) {
        console.error(`Error fetching ${type} meetings:`, error);
        return {
            success: false,
            message: error.response?.data?.message || `Failed to fetch ${type} meetings`,
            error: error
        };
    }
};

export const getRecentMeetings = () => getMeetingsByType('past');
export const getUpcomingMeetings = () => getMeetingsByType('upcoming');

/**
 * Fetch all meetings
 * @returns {Promise} - Promise with all meetings data
 */
export const getAllMeetings = async () => {
    try {
        const response = await api.get('/meetings');
        return {
            success: true,
            data: response.data.data || []
        };
    } catch (error) {
        console.error('Error fetching all meetings:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch meetings',
            error: error
        };
    }
};

/**
 * Create a new meeting
 * @param {Object} meetingData - Meeting data (title, meetingFrom, meetingTo, participantIds)
 * @returns {Promise} - Promise with created meeting data
 */
export const createMeeting = async (meetingData) => {
    try {
        const response = await api.post('/meetings', meetingData);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error creating meeting:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create meeting',
            error: error
        };
    }
};

/**
 * Validate a room code
 * @param {string} roomID - Room ID to validate
 * @returns {Promise} - Promise with validation result
 */
export const validateRoomCode = async (roomID) => {
    try {
        const response = await api.get(`/meetings/validate/${roomID}`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error validating room code:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Invalid meeting code',
            error: error
        };
    }
};

/**
 * Create an instant meeting
 * @returns {Promise} - Promise with created instant meeting data
 */
export const createInstantMeeting = async () => {
    try {
        const response = await api.post('/meetings/instant', {});
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error creating instant meeting:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create instant meeting',
            error: error
        };
    }
};

export default {
    getRecentMeetings,
    getUpcomingMeetings,
    getAllMeetings,
    createMeeting,
    validateRoomCode,
    createInstantMeeting
};
