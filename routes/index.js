const express = require('express');
const router  = express.Router();
const nodemailer = require('nodemailer')
const User = require('../models/User')
const {ensureLoggedIn} = require('connect-ensure-login')



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render('profile', {user:req.user})
})

module.exports = router;

