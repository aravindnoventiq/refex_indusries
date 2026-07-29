require("dotenv").config();
const { sequelize } = require("../models");

async function addFooterBackgroundColumns() {
  try {
    console.log("Checking and adding footer background columns...");
    
    // Check if columns exist and add them if they don't
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'footer' 
      AND COLUMN_NAME IN ('background_image', 'background_image_opacity')
    `);
    
    const existingColumns = results.map(r => r.COLUMN_NAME);
    
    if (!existingColumns.includes('background_image')) {
      console.log("Adding background_image column...");
      await sequelize.query(`
        ALTER TABLE footer 
        ADD COLUMN background_image TEXT NULL
      `);
      console.log("✓ background_image column added");
    } else {
      console.log("✓ background_image column already exists");
    }
    
    if (!existingColumns.includes('background_image_opacity')) {
      console.log("Adding background_image_opacity column...");
      await sequelize.query(`
        ALTER TABLE footer 
        ADD COLUMN background_image_opacity FLOAT NULL DEFAULT 0.1
      `);
      console.log("✓ background_image_opacity column added");
    } else {
      console.log("✓ background_image_opacity column already exists");
    }
    
    console.log("Footer background columns check complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding footer background columns:", error);
    process.exit(1);
  }
}

addFooterBackgroundColumns();

