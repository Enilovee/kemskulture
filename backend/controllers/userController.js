import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'
import generateToken from '../backutils/generateToken.js';
import { userValidationRules, validate } from '../middleware/validator.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { resetValidate, useResetValidationRules } from '../middleware/resetValidation.js';



// @descrp   Auth User & get token
// @route    POST/api/user/login
// @access    Public 
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
 
});

// @descrp   Register user
// @route    POST/api/user
// @access    Public 
const registerUser  =  [userValidationRules(), validate, asyncHandler(async (req, res) => {
 
  const{ name, email, phone, password} = req.body
  const  userEmailExists = await User.findOne({ email})
    if(userEmailExists){
      res.status(400)
      throw new Error('user already exist')
    }
  const  userPhoneExists = await User.findOne({ phone})
    if(userPhoneExists){
      res.status(400)
      throw new Error('user already exist')
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
    })

    if(user) {
      generateToken(res, user._id)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      })
    } else{
      res.status(400)
      throw new Error('Invalid user data')}
      
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });
  
    const mailOptions = {
        to: email,
        subject: `WELCOME ${email}` ,
        text: `
        Dear ${name},  
        
        \n\n Welcome to Kemskulture where elegance meets timeless fashion. We’re delighted to have you here!  
        
        \n\n Explore our collections, discover pieces that speak to you, and enjoy a seamless shopping experience. If you ever need assistance, we’re just an email away at *kemskulture@gmail.com* 
        
        \n\n Thank you for being part of our journey.  
        
        \n\nWith love,  
        KEMSKULTURE Team  
         `,
    };
  
    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ message: 'Error sending email' });
        res.json({ message: 'Password reset link sent' });
    });
    })];

// @descrp  Logout user& clr cookie
// @route    POST/api/user/logouto
// @access    Private 
const logoutUser  = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({ message: 'logged out successfully'})
 });

// @descrp  Get user profile
// @route    GET/api/user/logout
// @access    Private 
const getUserProfile  = asyncHandler( async (req, res) => {
  const user = await User.findById(req.user._id)

  if(user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin
  })
 } else{
  res.status(404)
  throw new Error('User Not found')
 }
 });

// @descrp  Update user profile
// @route    POST/api/user/logout
// @access    Private
const updateUserProfile  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if(user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone

    if( req.body.password){
      user.password = req.body.password
    }
    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
    })
  } else{
    res.status(404)
    throw new Error('User Not found')
  }
});

// @descrp  Get all user
// @route    GET/api/user
// @access    Private/Admin
const getAllUser  = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users)
});

// @descrp  Get  user by id
// @route    GET/api/user/:id
// @access    Private/Admin
const getUserByID  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

    if(user){
      res.status(200).json(user);
    }else{
      res.status(400)
      throw new Error('User not found')
    }
 });

// @descrp  Delete  user
// @route    POST/api/user/:id
// @access    Private/Admin
const deleteUser  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    if(user){
      if(user.isAdmin){
        res.status(400)
        throw new Error('Cannot delete admin')
      }
      await User.deleteOne({ _id : user._id})
      res.status(200).json({ message: " The user has been deleted"})
    } else{
      res.status(404)
      throw new Error('User does not exist')
    }
 });

// @descrp  Update  user
// @route    PUT/api/user/:id
// @access    Private/Admin
const UpdateUser  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)

      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User does not exist')
    }

 });
  
// @descrp   forgot password user
// @route    POST/api/user
// @access    Public 
 const forgotPassword =  asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User  not found' });

  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000*24; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
  });

  const mailOptions = {
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: http://localhost:3000/reset-password/${token}`,
  };

  transporter.sendMail(mailOptions, (error) => {
      if (error) return res.status(500).json({ message: 'Error sending email' });
      res.json({ message: 'Password reset link sent' });
  });
});
  
// @descrp   reset password user
// @route    POST/api/user
// @access    Public 
const resetPassword = [useResetValidationRules(), resetValidate, asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body; 
  

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    user.password = newPassword; // Store the hashed password
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpiration = undefined; // Clear the expiration
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(404)
    throw new Error('Server Error')
  }
}
)];



export{
    authUser,
     registerUser, 
     logoutUser, 
     getAllUser,
      getUserByID, 
      getUserProfile,                          
      updateUserProfile, 
      deleteUser, 
      UpdateUser,
      forgotPassword,
      resetPassword,   
}