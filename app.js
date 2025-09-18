if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const dbUrl = process.env.ATLASDB_URL ;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});


store.on("error",(err)=>[
    console.log("Error in mongo session store",err)
])
const sessionoption={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true ,
    },
};

app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
}); 

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



main()
.then(()=>{
    console.log("connected to db");
})
.catch((err) =>{
        console.log(err)
 });

async function main() {
  await mongoose.connect(dbUrl);
}
app.post("/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  (req, res) => {
    console.log("✅ User logged in:", req.user);
    res.redirect("/listings");
  }
);
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  console.log("User from passport:", req.user);
  next();
});

 

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
}); 





app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("home");   
});


app.all("/:id",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
let {statuscode = 500 , message="something went wrong"} = err;
res.status(statuscode).render("error.ejs", {message});
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server is running on port: ${port}`);
});
