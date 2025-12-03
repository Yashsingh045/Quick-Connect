import dotenv from "dotenv";
import prisma from "../config/config.js";


export const createMeeting = async (req, res) => {
    try {
        const { title, meetingFrom, meetingTo, participantIds } = req.body;

        if (!title || !meetingFrom || !meetingTo || !participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: title, meetingFrom, meetingTo, participantIds (array)"
            });
        }


        const hostId = req.user.id;
        const roomID = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Ensure host is in participant list
        const allParticipantIds = [...new Set([...participantIds, hostId])];

        const validParticipants = await prisma.users.findMany({
            where: {
                id: { in: allParticipantIds.map(id => parseInt(id)) }
            }
        });

        if (validParticipants.length !== allParticipantIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more participant IDs are invalid"
            });
        }

        const newMeeting = await prisma.meetings.create({
            data: {
                title,
                meetingFrom: new Date(meetingFrom),
                meetingTo: new Date(meetingTo),
                roomID,
                hostId,
                participants: {
                    connect: allParticipantIds.map(id => ({ id: parseInt(id) }))
                }
            },
            include: {
                participants: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: newMeeting
        });

    } catch (error) {
        console.error("Error creating meeting:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create meeting",
            error: error.message
        });
    }
};


export const updateMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { title, meetingFrom, meetingTo, participantIds } = req.body;

        if (!meetingId) {
            return res.status(400).json({
                success: false,
                message: "Meeting ID is required"
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (meetingFrom) updateData.meetingFrom = new Date(meetingFrom);
        if (meetingTo) updateData.meetingTo = new Date(meetingTo);
        if (participantIds && Array.isArray(participantIds)) {

            const validParticipants = await prisma.users.findMany({
                where: {
                    id: { in: participantIds.map(id => parseInt(id)) }
                }
            });

            if (validParticipants.length !== participantIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more participant IDs are invalid"
                });
            }

            updateData.participants = {
                set: participantIds.map(id => ({ id: parseInt(id) }))
            };
        }

        const updatedMeeting = await prisma.meetings.update({
            where: {
                meetingId: parseInt(meetingId)
            },
            data: updateData,
            include: {
                participants: true
            }
        });

        return res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            data: updatedMeeting
        });

    } catch (error) {
        console.error("Error updating meeting:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update meeting",
            error: error.message
        });
    }
};


export const readMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;

        if (meetingId) {
            const meeting = await prisma.meetings.findUnique({
                where: {
                    meetingId: parseInt(meetingId)
                },
                include: {
                    participants: true
                }
            });

            if (!meeting) {
                return res.status(404).json({
                    success: false,
                    message: "Meeting not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: meeting
            });
        } else {
            const meetings = await prisma.meetings.findMany({
                include: {
                    participants: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.status(200).json({
                success: true,
                data: meetings
            });
        }

    } catch (error) {
        console.error("Error reading meeting:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to read meeting",
            error: error.message
        });
    }
};


export const deleteMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;

        if (!meetingId) {
            return res.status(400).json({
                success: false,
                message: "Meeting ID is required"
            });
        }

        const deletedMeeting = await prisma.meetings.delete({
            where: {
                meetingId: parseInt(meetingId)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Meeting deleted successfully",
            data: deletedMeeting
        });

    } catch (error) {
        console.error("Error deleting meeting:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete meeting",
            error: error.message
        });
    }
};


export const getRecentMeetings = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type } = req.query; // 'past' or 'upcoming'

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const now = new Date();
        let whereCondition = {
            participants: {
                some: {
                    id: userId
                }
            }
        };

        let orderBy = { createdAt: 'desc' };

        if (type === 'upcoming') {
            whereCondition.meetingFrom = {
                gt: now
            };
            orderBy = { meetingFrom: 'asc' };
        } else {
            // Default to past/recent meetings
            whereCondition.meetingFrom = {
                lte: now
            };
            orderBy = { meetingFrom: 'desc' };
        }

        const meetings = await prisma.meetings.findMany({
            where: whereCondition,
            include: {
                participants: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                }
            },
            orderBy: orderBy,
            take: 10
        });

        return res.status(200).json({
            success: true,
            data: meetings
        });
    } catch (error) {
        console.error("Error fetching meetings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch meetings",
            error: error.message
        });
    }
};


export const validateRoomCode = async (req, res) => {
    try {
        const { roomID } = req.params;

        if (!roomID) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        const meeting = await prisma.meetings.findUnique({
            where: { roomID: roomID },
            include: {
                participants: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                }
            }
        });

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Invalid meeting code. Please check and try again."
            });
        }

        return res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        console.error("Error validating room code:", error);
        return res.status(500).json({
            success: false,
            message: "Error validating room code",
            error: error.message
        });
    }
};


export const createInstantMeeting = async (req, res) => {
    try {
        const hostId = req.user?.id;

        if (!hostId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Generate unique 8-digit room ID
        const roomID = Math.floor(10000000 + Math.random() * 90000000).toString();

        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        const meeting = await prisma.meetings.create({
            data: {
                title: "Instant Meeting",
                roomID,
                hostId,
                meetingFrom: now,
                meetingTo: oneHourLater,
                participants: {
                    connect: [{ id: hostId }]
                }
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Instant meeting created successfully",
            data: meeting
        });
    } catch (error) {
        console.error("Error creating instant meeting:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create instant meeting",
            error: error.message
        });
    }
};