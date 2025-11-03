import dotenv from "dotenv"
import prisma from "../config/config.js"




export const createMeeting = async(req,res) => {
    try {
    
        const { title, meetingFrom, meetingTo, participantIds } = req.body;

        if (!title || !meetingFrom || !meetingTo || !participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: title, meetingFrom, meetingTo, participantIds (array)"
            });
        }

        const newMeeting = await prisma.meetings.create({
            data: {
                title,
                meetingFrom: new Date(meetingFrom),
                meetingTo: new Date(meetingTo),
                participants: {
                    connect: participantIds.map(id => ({ id: parseInt(id) }))
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
}



export const updateMeeting = async(req,res) => {
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
}



export const readMeeting = async(req,res) => {
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
}



export const deleteMeeting = async(req,res) => {
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
}



export const readAllMeetings = async(req,res) => {
    try {
        const meetings = await prisma.meetings.findMany({
            include: {
                participants: true
            }
        });

        return res.status(200).json({
            success: true,
            data: meetings
        });
    } catch (error) {
        console.error("Error reading meetings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to read meetings",
            error: error.message
        });
    }
}
