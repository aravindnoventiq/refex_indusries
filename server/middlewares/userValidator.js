const { check } = require("express-validator");
const Type = require("../utils/userTypes");

const validation = {
  createUserSchema: [
    check("firstName").exists().withMessage("First Name is required").notEmpty().withMessage("First Name should not be empty"),
    check("lastName").exists().withMessage("Last Name is required").notEmpty().withMessage("Last Name should not be empty"),
    check("mobileNumber").exists().withMessage("Phone is required").notEmpty().withMessage("Mobile Number should not be empty"),
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    // check("password")
    //   .exists()
    //   .withMessage("Password is required")
    //   .notEmpty()
    //   .isLength({ min: 6 })
    //   .withMessage("Password must contain at least 6 characters"),
    check("userType")
      .optional()
      .isIn([Type.SuperAdmin, Type.Admin, Type.User, Type.InvestorsCMS])
      .withMessage("Invalid Role type"),
  ],
  validateLogin: [
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    check("password")
      .exists()
      .withMessage("Password is required")
      .notEmpty()
      .withMessage("Password must be filled"),
  ],
};

module.exports = validation;
