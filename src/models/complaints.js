const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
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
    natureOfComplaint: {
        type: String,
        enum: ['Maintenance Issue', 'Noise Complaint', 'Safety Concern', 'Hygiene Issue', 'Other'],
        required: true
    },
    otherDescription: {
        type: String
    },
    complaintDetails: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        required: true
    },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;