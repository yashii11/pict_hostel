const express=require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");
const warden=require("./models/warden");
const multer=require("multer");
const session=require("express-session");

const storage1 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/uploads/notice');
    },
    filename: function(req, file, cb) {
        cb(null, "notice.pdf");
    },
});

const storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/uploads/menu');
    },
    filename: function(req, file, cb) {
        cb(null, "menu.pdf");
    },
});


const uploadNotice=multer({storage:storage1});
const uploadMenu=multer({storage:storage2});

require("./db/conn");
const Register=require("./models/registers");

const port=process.env.PORT || 3000;
const static_path=path.join(__dirname,"..");
const view_path=path.join(__dirname,"../views");
// console.log(path.join(__dirname,"../public"))
console.log(view_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));

app.use(session(
    {secret: 'supersecretestring',
    resave: false,
    saveUninitialized: true,
    // cookie: { 
    //     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //     httpOnly:true,
    // },
}));

app.use((req,res,next)=>{
    if(req.session.flash){
        res.locals.flash=req.session.flash;
        delete req.session.flash;
    }
    next();
})

app.set("view engine","hbs");
app.set("views",view_path)
app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/login",(req,res)=>{
    res.render("login",{flash: res.locals.flash});
})

app.get("/register",(req,res)=>{
    res.render("register");
})

//create a new user in our database
app.post("/register", async (req,res)=>{
    try {
        
        const password=req.body.password;
        const cpassword=req.body.confirmpassword;
        if(password===cpassword){
            const registerStudent=new Register({
                fname: req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword,
                gender:req.body.gender,
                phone:req.body.phone,
                address:req.body.address,
                dob:req.body.dob,
                yog:req.body.yearOfGrad,
                bloodgroup:req.body.bloodgroup,
                registerID:req.body.registerID,
                state:req.body.state
            })

            const registered=await registerStudent.save();
            res.status(201).render("login")
        } else{
            res.send("Passwords are not matching!!");
        }


    } catch(error){
        res.status(400).send(error);
    }
})


//login validation
app.post("/login",async (req,res)=>{
    try{
        const email=req.body.email;
        req.session.mail=email;
        const password=req.body.password;
        console.log(`email:${email} and password: ${password}`);
        const useracc=await Register.findOne({email:email});

        if(useracc.password===password){
            res.status(201).render("student",{user:useracc});
            req.session.flash={type:'success',message:'Login Successful!'};
        }else{
            req.session.flash={type:'error',message:'Invalid login credentials!'}
            // res.send("invalid login details");
            res.redirect('/');
        }

        // res.send(useracc);
        // console.log(useracc);
    } catch(error){
        res.status(400).send("invalid login details");
        console.log(error);
    }
})


app.get('/staff',async (req,res)=>
{
    try
    {
        res.render('warden_login');
    }
    catch(err)
    {
        res.send("error in staff")
    }
})
app.post('/staff',async(req,res)=>
{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const collegeID=req.body.collegeID;
        console.log(`email:${email} and password: ${password}`);
        const useracc=await warden.findOne({email:email});

        if(useracc.password===password && useracc.collegeID===collegeID){
            res.status(201).render("warden",{user:useracc});
        }else{
            res.send("invalid login details");
        }
    }catch(err)
    {

    }
})

app.get("/profile", async (req,res)=>{
    
    const useracc=await Register.findOne({email:req.session.mail});

    res.status(201).render("profile",{user:useracc});
})

app.post('/uploadNotice',uploadNotice.single("notice"),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    return res.render("warden");
});

app.post('/uploadMenu',uploadMenu.single("menu"),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    return res.render("warden");
});

app.get('/guidelines',(req,res)=>{
    res.render("guidelines");
})

app.get('/logout',(req,res)=>{
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Redirect the user to a different page after logout
        res.redirect('/');
    });
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})