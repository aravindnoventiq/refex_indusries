/**
 * Migration script to add 'InvestorsCMS' user type to the database
 * 
 * This script updates the User model's user_type ENUM to include 'InvestorsCMS'
 * 
 * Run this script with: node server/scripts/add_investors_cms_user_type.js
 */

require("dotenv").config();
const { sequelize } = require("../models");

async function addInvestorsCMSUserType() {
  try {
    console.log("Starting migration to add InvestorsCMS user type...");

    // Get the database name from the connection
    const dbName = sequelize.config.database;
    const queryInterface = sequelize.getQueryInterface();

    // Check current ENUM values
    const [results] = await sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${dbName}' 
      AND TABLE_NAME = 'Users' 
      AND COLUMN_NAME = 'user_type'
    `);

    if (results.length > 0) {
      const currentEnum = results[0].COLUMN_TYPE;
      console.log("Current user_type ENUM:", currentEnum);

      // Check if InvestorsCMS already exists
      if (currentEnum.includes("InvestorsCMS")) {
        console.log("InvestorsCMS user type already exists in the database.");
        return;
      }

      // Add InvestorsCMS to the ENUM
      // Note: MySQL doesn't support direct ALTER ENUM, so we need to modify the column
      await sequelize.query(`
        ALTER TABLE Users 
        MODIFY COLUMN user_type ENUM('Admin', 'CHRO', 'HR', 'InvestorsCMS')
      `);

      console.log("✓ Successfully added InvestorsCMS user type to the database");
    } else {
      console.log("Warning: Could not find user_type column. Make sure the Users table exists.");
    }

    await sequelize.close();
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
addInvestorsCMSUserType();

