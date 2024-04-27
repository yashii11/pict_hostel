const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
  });

  // Create Attendance model
  const Attendance = mongoose.model("Attendance", attendanceSchema);

  module.exports = Attendance;