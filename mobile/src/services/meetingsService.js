import api from './api';

/**
 * Fetch recent meetings for the logged-in user
 * @returns {Promise} - Promise with recent meetings data
 */
export const getRecentMeetings = async () => {
    try {
        const response = await api.get('/meetings/recent');
        return {
            success: true,
            data: response.data.data || []
        };
    } catch (error) {
        console.error('Error fetching recent meetings:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch recent meetings',
            error: error
        };
    }
};

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

export default {
    getRecentMeetings,
    getAllMeetings,
    createMeeting
};
