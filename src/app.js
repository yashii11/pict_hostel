const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const multer = require("multer");
const session = require("express-session");

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/notice');
    },
    filename: function (req, file, cb) {
        cb(null, "notice.pdf");
    },
});

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/menu');
    },
    filename: function (req, file, cb) {
        cb(null, "menu.pdf");
    },
});


const uploadNotice = multer({ storage: storage1 });
const uploadMenu = multer({ storage: storage2 });

require("./db/conn");
const Register = require("./models/registers");
const warden = require("./models/warden");
const applicant = require("./models/applicants");
const Attendance = require("./models/attendance");
const Complaint = require("./models/complaints");
const LeaveRequest = require("./models/leaveRequests");


const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../templates/views");
// console.log(path.join(__dirname,"../public"))
console.log(view_path);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.use(session(
    {
        secret: 'supersecretestring',
        resave: false,
        saveUninitialized: true,
        // cookie: { 
        //     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        //     httpOnly:true,
        // },
    }));

app.use((req, res, next) => {
    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }
    next();
})

app.set("view engine", "hbs");
app.set("views", view_path);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("login", { flash: res.locals.flash });
})

app.get("/register", (req, res) => {
    res.render("register");
})

//create a new user in our database
// app.post("/register", async (req,res)=>{
//     try {

//         const password=req.body.password;
//         const cpassword=req.body.confirmpassword;
//         if(password===cpassword){
//             const registerStudent=new Register({
//                 fname: req.body.fname,
//                 lname:req.body.lname,
//                 email:req.body.email,
//                 password:req.body.password,
//                 confirmpassword:req.body.confirmpassword,
//                 gender:req.body.gender,
//                 phone:req.body.phone,
//                 address:req.body.address,
//                 dob:req.body.dob,
//                 yog:req.body.yearOfGrad,
//                 bloodgroup:req.body.bloodgroup,
//                 registerID:req.body.registerID,
//                 state:req.body.state
//             })

//             const registered=await registerStudent.save();
//             res.status(201).render("login")
//         } else{
//             res.send("Passwords are not matching!!");
//         }


//     } catch(error){
//         res.status(400).send(error);
//     }
// })

app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerStudent = new applicant({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                gender: req.body.gender,
                phone: req.body.phone,
                address: req.body.address,
                dob: req.body.dob,
                yog: req.body.yearOfGrad,
                bloodgroup: req.body.bloodgroup,
                registerID: req.body.registerID,
                state: req.body.state
            })

            const registered = await registerStudent.save();
            res.status(201).render("login")
        } else {
            res.send("Passwords are not matching!!");
        }


    } catch (error) {
        res.status(400).send(error);
    }
})



//login validation
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        req.session.mail = email;
        const password = req.body.password;
        console.log(`email:${email} and password: ${password}`);
        const useracc = await Register.findOne({ email: email });

        if (useracc.password === password) {
            res.status(201).render("student", { user: useracc });
            req.session.flash = { type: 'success', message: 'Login Successful!' };
        } else {
            req.session.flash = { type: 'error', message: 'Invalid login credentials!' }
            // res.send("invalid login details");
            res.redirect('/');
        }

        // res.send(useracc);
        // console.log(useracc);
    } catch (error) {
        res.status(400).send("invalid login details");
        console.log(error);
    }
})


app.get('/staff', async (req, res) => {
    try {
        res.render('warden_login');
    }
    catch (err) {
        res.send("error in staff")
    }
})
app.post('/staff', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const collegeID = req.body.collegeID;
        console.log(`email:${email} and password: ${password}`);
        const useracc = await warden.findOne({ email: email });

        if (useracc.password === password && useracc.collegeID === collegeID) {
            res.status(201).render("warden", { user: useracc });
        } else {
            res.send("invalid login details");
        }
    } catch (err) {

    }
})

app.get('/applicants', async (req, res) => {
    try {
        const data = await applicant.find();
        //  console.log("data",data)
        if (data.length > 0) {
            res.render('applicants', { data: data });
        }
        else {
            res.render('nostudent');
            //res.status(200).send("No student found");
        }


    }
    catch (err) {
        console.log("error in adding student");
    }
})

app.post('/add', async (req, res) => {
    try {
        const { email } = req.body;

        const data = await applicant.findOne({ email });

        console.log(data);
        const registerStudent = new Register({
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            password: data.password,
            confirmpassword: data.confirmpassword,
            gender: data.gender,
            phone: data.phone,
            address: data.address,
            dob: data.dob,
            yog: data.yog,
            bloodgroup: data.bloodgroup,
            registerID: data.registerID,
            state: data.state
        })

        console.log(registerStudent);
        const registered = await registerStudent.save();
        console.log(registered);
        const re1 = await applicant.deleteOne({ email });
        console.log(re1);

    }
    catch (err) {
        console.log('cannot add', err);
    }
})


app.post('/remove', async (req, res) => {
    try {
        const { email } = req.body;
        const data = await applicant.findOne({ email });
        console.log(data);
        const res1 = await applicant.deleteOne({ email });
        console.log(res1);
    }
    catch (err) {
        console.log('cannot add');
    }
})

app.get("/profile", async (req, res) => {

    const useracc = await Register.findOne({ email: req.session.mail });

    res.status(201).render("profile", { user: useracc });
})

app.post('/uploadNotice', uploadNotice.single("notice"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.render("warden");
});

app.post('/uploadMenu', uploadMenu.single("menu"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.render("warden");
});

app.get('/guidelines', (req, res) => {
    res.render("guidelines");
})

app.get('/logout', (req, res) => {
    // req.session.destroy(err => {
    //     if (err) {
    //         console.error('Error destroying session:', err);
    //         return res.status(500).send('Internal Server Error');
    //     }else{
    //         // Redirect the user to a different page after logout

    //     res.redirect('/');
    //     console.log("logged out");
    //     }

    // });
    req.session.destroy();
    res.redirect('/');
})

app.get('/aboutus', (req, res) => {
    try {
        res.render('aboutus');

    } catch (error) {
        console.log(error.message);
    }
})

// Update a student record
// app.get('/updateDetails/:id', async (req, res) => {
//     const studentId = req.params.id;
//     const updatedData = req.body;

//     try {
//       // Update the student record in the database
//       const updatedStudent = await Register.findByIdAndUpdate(studentId, updatedData, { new: true });

//       if (!updatedStudent) {
//         return res.status(404).json({ message: 'Student not found' });
//       }

//       res.status(200).json({ message: 'Student record updated successfully', updatedStudent });
//     } catch (error) {
//       console.error('Error updating student record:', error);
//       res.status(500).json({ message: 'Error updating student record' });
//     }

//   });


// Route handler to handle POST request to update student
app.post('/updateStudent/:id', (req, res) => {
    const studentId = req.params; // Extract student ID from URL parameter
    const modifiedData = req.body; // Extract modified data from request body

    try{
        Register.findByIdAndUpdate(studentId, modifiedData);
        res.redirect("/viewStudent");
    }
    catch(err)
    {
        console.log("Error updating student",err.message);
        res.status(500).send("Error updating data");
    }

    // Update student record in the database with the modified data
    // updateStudentById(studentId, modifiedData)
    //     .then(() => {
    //         res.status(200).send('Student updated successfully');
    //     })
    //     .catch(error => {
    //         console.error('Error updating student:', error);
    //         res.status(500).send('Error updating student');
    //     });
});



// Delete a student record
app.get('/deleteStudent/:id', async (req, res) => {
    const studentId = req.params.id;

    try {
        // Delete the student record from the database
        const deletedStudent = await Register.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student record deleted successfully', deletedStudent });
    } catch (error) {
        console.error('Error deleting student record:', error);
        res.status(500).json({ message: 'Error deleting student record' });
    }
});



app.get('/viewStudents', async (req, res) => {
    try {
        const data = await Register.find();
        //console.log(data);
        res.render('viewStudent', { data: data });
    }
    catch (err) {
        console.log(err);
    }
})

app.get('/complaint', (req, res) => {
    try {
        res.render('complaint');

    } catch (error) {
        console.log(error.message);
    }
})

app.get('/leaveRequest', (req, res) => {
    try {
        res.render('leaveRequest');

    } catch (error) {
        console.log(error.message);
    }
})

app.get('/viewComplaint', async (req, res) => {
    try {
        // Fetch all complaints from the database
        const complaints = await Complaint.find({});
        const totalComplaints = complaints.length; // Calculate total number of complaints
        res.render("viewComplaint", { complaints, totalComplaints });
    }
    catch (err) {
        console.error("Error fetching complaints:", err);
        // req.flash("error", "Error fetching complaints. Please try again.");
        res.redirect("/");
    }
})

app.get('/viewLeaveRequests', async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({});
        const totalLeaveRequests = leaveRequests.length;
        res.render("viewLeaveReq", { leaveRequests, totalLeaveRequests });
    }
    catch (err) {
        console.error("Error fetching leave requests:", err);
        //req.flash("error", "Error fetching complaints. Please try again.");
        res.redirect("/viewLeaveRequests");
    }
})

app.post("/complaint", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            roomNo,
            natureOfComplaint,
            otherDescription,
            complaintDetails,
            urgency
        } = req.body;

        // Create a new Complaint instance with the file path
        const newComplaint = new Complaint({
            firstName,
            lastName,
            email,
            roomNo,
            natureOfComplaint,
            otherDescription,
            complaintDetails,
            urgency,
        });
        if (newComplaint.email === req.session.mail) {
            // Save the complaint to the database
            await newComplaint.save();
            // req.session.message= { type: 'success', message: 'Login Successful!' };
            // req.flash("success", "Complaint submitted successfully!");
            // console.log("success");
            const useracc = await Register.findOne({ email: newComplaint.email });
            res.status(201).render("student", { user: useracc });
            // res.redirect("student");
        }
        else {
            res.redirect("complaint");
        }
    }

    catch (err) {
        console.error("Error submitting complaint:", err);
        // req.flash("failure", "Error submitting complaint. Please try again.");

        res.redirect("complaint");
    }
});

app.post("/leaveRequest", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            roomNo,
            leaveType,
            otherDescription,
            leaveStart,
            leaveEnd,
            comments
        } = req.body;

        let formattedLeaveType;
        if (Array.isArray(leaveType)) {
            formattedLeaveType = leaveType.filter(type => type !== '').join(', ');
        }
        else {
            formattedLeaveType = leaveType;
        }

        const newLeaveRequest = new LeaveRequest({
            firstName,
            lastName,
            email,
            roomNo,
            leaveType: formattedLeaveType,
            otherDescription: leaveType === 'Other' ? otherDescription : undefined,
            leaveStart,
            leaveEnd,
            comments,
        });

        if (newLeaveRequest.email === req.session.mail) {
            // Save the complaint to the database
            await newLeaveRequest.save();
            // req.session.message= { type: 'success', message: 'Login Successful!' };
            // req.flash("success", "Complaint submitted successfully!");
            console.log("success");
            const useracc = await Register.findOne({ email: req.session.mail });
            res.status(201).render("student", { user: useracc });
            // res.redirect("student");
        }
        else {
            res.redirect("leaveRequest");
        }


    }
    catch (err) {
        console.error("Error submitting complaint:", err);
        // req.flash("failure", "Error submitting request! Please try again.");
        res.redirect("leaveRequest");
    }
});

app.get('/deleteComplaint/:id', async (req, res) => {
    const id = req.params.id;
    try {
        console.log(id);
        await Complaint.findByIdAndDelete(id);
        res.redirect("/viewComplaint");
    } catch (err) {
        console.error("Error deleting complaint", err.message);
        res.status(500).send("Error deleting complaint.");
    }
});

app.get("/deleteLeaveRequest/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // Find the complaint by ID and delete it from the database
        await LeaveRequest.findByIdAndDelete(id);
        // Redirect back to the view complaints page
        res.redirect("/viewLeaveRequests");
    } catch (err) {
        console.error("Error deleting request", err);
        res.status(500).send("Error deleting request.");
    }
});

// Define paths for marking attendance and viewing attendance
app.get("/markAttendance", async (req, res) => {
    const data = await Register.find();
    res.render("markAttendance", { students: data });
});

app.post("/mark-attendance", async (req, res) => {
    try {

        res.redirect("/"); // Redirect to home page or any other appropriate page
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).send("Error marking attendance.");
    }
});

app.get("/view-attendance", async (req, res) => {
    try {
        // Fetch attendance data from the database
        const attendanceData = await Attendance.find({});
        res.render("view-attendance", { attendanceData });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).send("Error fetching attendance.");
    }
});




app.listen(port, () => {
    console.log(`listening on port ${port}`);
})