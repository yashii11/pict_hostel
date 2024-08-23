const mongoose = require("mongoose");

const leavingSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    roomNo: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        required: true
    },
    otherDescription: {
        type: String
    },
    leaveStart: {
        type: String,
        required: true
    },
    leaveEnd: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
});

const LeaveRequest = mongoose.model("LeaveRequest", leavingSchema);

module.exports = LeaveRequest;