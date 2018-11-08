const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmationCode= randomstring.generate(30);
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    // const hashUsername = bcrypt.hashSync(username, salt);

    const newUser = new User({
      email,
      username,
      password: hashPass,
      confirmationCode
    });

    newUser.save()
    .then(() => {
      //  res.redirect("/send-email");
       let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      transporter.sendMail({
        from: '"Lab-nodemailer-project 👻" <charlottetreuse42@gmail.com>',
        to: email, 
        subject: "Account verification", 
        html: `<b>Please click on the following link: <a href="http://localhost:3000/auth/confirm/${confirmationCode}" target="_blank">here</a> to verify your account</b>`
      })
      .then(info => res.redirect('/auth/verify'))
      .catch(error => console.log(error));
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/verify', (req, res, next) => {
  console.log("HELLLOOO")
  res.render('messages');
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


router.get('/confirm/:confirmCode', (req, res, next) => {
let goodCode = req.params.confirmCode
User.find({confirmationCode: "goodCode"})
.then (user => {
User.update({confirmationCode:"goodCode"},{status:"Active"})
console.log("IT WORKS!!!!!!")
res.render('index')
})
.catch (error =>{
  next(error)
})
}
  )


 router.get('/confirm', (req, res, next) => {
res.render('confirm')
 })
 
 

module.exports = router;
