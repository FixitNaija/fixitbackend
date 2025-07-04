const Joi = require('joi');

// User Signup Validation
const userSignupSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

// User Login Validation
const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Issue Creation Validation
const createIssueSchema = Joi.object({
  title: Joi.string().min(8).max(100).required(),
  description: Joi.string().min(20).required(),
  category: Joi.string().required(),
  state: Joi.string().required(),
  location: Joi.string().required(),
  images: Joi.any().optional(),
});

// Password Reset Validation
const passwordResetSchema = Joi.object({
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).required(),
});

// Admin Signup Validation
const adminSignupSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

// Export all schemas
module.exports = {
  userSignupSchema,
  userLoginSchema,
  createIssueSchema,
  passwordResetSchema,
  adminSignupSchema
};