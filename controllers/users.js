const User = require("../models/user.js");

module.exports.signup=async(req,res)=>{
    try{
let{username,email,password} = req.body;
const newUser = new User({email,username});
let registeredUser = await User.register(newUser,password);
console.log(registeredUser);
req.login(registeredUser,(err)=>{
    if(err){
        return err;
    }
req.flash("success","Welcome to WanderLust");
res.redirect("/listings");
})
    }
    catch(e){
        req.flash("error","username already exist");
        res.redirect("/signup");
    }
}

module.exports.renderSignupForm=(req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.renderLoginForm=(req,res)=>{
res.render("user/login.ejs");
}
module.exports.login=(req,res)=>{
req.flash("success","Welcome to WanderLust");
let redirect = res.locals.redirect || "/listings";
res.redirect(redirect );
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next (err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    })
}
