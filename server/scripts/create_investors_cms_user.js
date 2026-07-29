/**
 * Script to create an InvestorsCMS user
 * 
 * This script creates a default InvestorsCMS user with the following credentials:
 * Email: investors@refex.com
 * Password: Investors@2025
 * 
 * Run this script with: node server/scripts/create_investors_cms_user.js
 * 
 * You can modify the credentials below before running the script.
 */

require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

const DEFAULT_CREDENTIALS = {
  firstName: "Investors",
  lastName: "CMS User",
  email: "investors@refex.com",
  password: "Investors@2025",
  mobileNumber: "9999999999",
  userType: "InvestorsCMS"
};

async function createInvestorsCMSUser() {
  try {
    console.log("Creating InvestorsCMS user...");
    console.log("Email:", DEFAULT_CREDENTIALS.email);
    console.log("Password:", DEFAULT_CREDENTIALS.password);

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email: DEFAULT_CREDENTIALS.email } 
    });

    if (existingUser) {
      console.log("User with this email already exists!");
      console.log("User ID:", existingUser.id);
      console.log("User Type:", existingUser.user_type);
      
      // Update user type if it's not InvestorsCMS
      if (existingUser.user_type !== "InvestorsCMS") {
        await User.update(
          { user_type: "InvestorsCMS" },
          { where: { id: existingUser.id } }
        );
        console.log("✓ Updated user type to InvestorsCMS");
      }
      
      return;
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(DEFAULT_CREDENTIALS.password, saltRounds);

    // Create the user
    const newUser = await User.create({
      id: uuidv4(),
      first_name: DEFAULT_CREDENTIALS.firstName,
      last_name: DEFAULT_CREDENTIALS.lastName,
      email: DEFAULT_CREDENTIALS.email,
      password: hashedPassword,
      mobile_number: DEFAULT_CREDENTIALS.mobileNumber,
      user_type: DEFAULT_CREDENTIALS.userType,
      is_active: true,
      created_at: new Date(),
      modified_at: new Date(),
    });

    console.log("✓ InvestorsCMS user created successfully!");
    console.log("User ID:", newUser.id);
    console.log("\nLogin Credentials:");
    console.log("Email:", DEFAULT_CREDENTIALS.email);
    console.log("Password:", DEFAULT_CREDENTIALS.password);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    
    if (error.name === "SequelizeDatabaseError" && error.message.includes("ENUM")) {
      console.error("\n⚠️  Error: InvestorsCMS user type not found in database.");
      console.error("Please run the migration script first:");
      console.error("node server/scripts/add_investors_cms_user_type.js");
    }
    
    process.exit(1);
  }
}

// Run the script
createInvestorsCMSUser();

