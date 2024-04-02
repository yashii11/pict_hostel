const express=require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");
const warden=require("./models/warden");

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
app.set("view engine","hbs");
app.set("views",view_path)
app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/login",(req,res)=>{
    res.render("login");
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
            const registerStudent=new Register(req.body);
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
        const password=req.body.password;
        console.log(`email:${email} and password: ${password}`);
        const useracc=await Register.findOne({email:email});

        if(useracc.password===password){
            res.status(201).render("student",{user:useracc});
        }else{
            res.send("invalid login details");
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
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})