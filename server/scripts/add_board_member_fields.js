/**
 * Migration script to add linkedin, biography, and directorship_details columns
 * to the leadership_members table
 * 
 * Run with: node scripts/add_board_member_fields.js
 */

require("dotenv").config();
const { sequelize } = require("../models");

async function addColumns() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Check if columns already exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'leadership_members' 
      AND COLUMN_NAME IN ('linkedin', 'biography', 'directorship_details')
    `);

    const existingColumns = results.map(r => r.COLUMN_NAME);
    console.log("Existing columns found:", existingColumns);

    // Add columns that don't exist
    if (!existingColumns.includes('linkedin')) {
      console.log("Adding 'linkedin' column...");
      await sequelize.query(`
        ALTER TABLE leadership_members 
        ADD COLUMN linkedin TEXT NULL
      `);
      console.log("✓ Added 'linkedin' column");
    } else {
      console.log("✓ 'linkedin' column already exists");
    }

    if (!existingColumns.includes('biography')) {
      console.log("Adding 'biography' column...");
      await sequelize.query(`
        ALTER TABLE leadership_members 
        ADD COLUMN biography TEXT NULL
      `);
      console.log("✓ Added 'biography' column");
    } else {
      console.log("✓ 'biography' column already exists");
    }

    if (!existingColumns.includes('directorship_details')) {
      console.log("Adding 'directorship_details' column...");
      await sequelize.query(`
        ALTER TABLE leadership_members 
        ADD COLUMN directorship_details TEXT NULL
      `);
      console.log("✓ Added 'directorship_details' column");
    } else {
      console.log("✓ 'directorship_details' column already exists");
    }

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

addColumns();

