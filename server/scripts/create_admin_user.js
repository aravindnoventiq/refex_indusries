/**
 * Script to create an Admin user
 * 
 * This script creates a default Admin user with the following credentials:
 * Email: admin@refex.com
 * Password: admin123
 * 
 * Run this script with: node server/scripts/create_admin_user.js
 */

require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

const ADMIN_CREDENTIALS = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@refex.com",
  password: "admin123",
  mobileNumber: "9999999998",
  userType: "Admin"
};

async function createAdminUser() {
  try {
    console.log("Creating Admin user...");
    console.log("Email:", ADMIN_CREDENTIALS.email);
    console.log("Password:", ADMIN_CREDENTIALS.password);

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email: ADMIN_CREDENTIALS.email } 
    });

    if (existingUser) {
      console.log("User with this email already exists!");
      console.log("User ID:", existingUser.id);
      console.log("User Type:", existingUser.user_type);
      
      // Update password if needed (in case it was changed)
      const passwordMatch = await bcrypt.compare(ADMIN_CREDENTIALS.password, existingUser.password);
      if (!passwordMatch) {
        const hashedPassword = bcrypt.hashSync(ADMIN_CREDENTIALS.password, saltRounds);
        await User.update(
          { 
            password: hashedPassword,
            user_type: "Admin",
            is_active: true
          },
          { where: { id: existingUser.id } }
        );
        console.log("✓ Updated password and user type to Admin");
      } else {
        // Just ensure user type and active status
        if (existingUser.user_type !== "Admin" || !existingUser.is_active) {
          await User.update(
            { 
              user_type: "Admin",
              is_active: true
            },
            { where: { id: existingUser.id } }
          );
          console.log("✓ Updated user type to Admin and activated user");
        } else {
          console.log("✓ User already exists with correct settings");
        }
      }
      
      return;
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(ADMIN_CREDENTIALS.password, saltRounds);

    // Create the user
    const newUser = await User.create({
      id: uuidv4(),
      first_name: ADMIN_CREDENTIALS.firstName,
      last_name: ADMIN_CREDENTIALS.lastName,
      email: ADMIN_CREDENTIALS.email,
      password: hashedPassword,
      mobile_number: ADMIN_CREDENTIALS.mobileNumber,
      user_type: ADMIN_CREDENTIALS.userType,
      is_active: true,
      created_at: new Date(),
      modified_at: new Date(),
    });

    console.log("✓ Admin user created successfully!");
    console.log("User ID:", newUser.id);
    console.log("\nLogin Credentials:");
    console.log("Email:", ADMIN_CREDENTIALS.email);
    console.log("Password:", ADMIN_CREDENTIALS.password);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    console.error("Full error:", error);
    
    if (error.name === "SequelizeDatabaseError" && error.message.includes("ENUM")) {
      console.error("\n⚠️  Error: Admin user type not found in database.");
    }
    
    process.exit(1);
  }
}

// Run the script
createAdminUser();

