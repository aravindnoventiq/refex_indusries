require("dotenv").config();
const { sequelize } = require("../models");

async function checkFooterColumns() {
  try {
    console.log("Checking footer table columns...");
    
    // Check if background_image column exists
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'footer' 
      AND COLUMN_NAME LIKE 'background%'
    `);
    
    console.log("Background columns found:");
    columns.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE}, default: ${col.COLUMN_DEFAULT})`);
    });
    
    // Check current values in footer table
    const [rows] = await sequelize.query('SELECT id, background_image, background_image_opacity FROM footer ORDER BY id DESC LIMIT 1');
    console.log("\nCurrent footer data:");
    if (rows.length > 0) {
      console.log(`  ID: ${rows[0].id}`);
      console.log(`  background_image: ${rows[0].background_image}`);
      console.log(`  background_image_opacity: ${rows[0].background_image_opacity}`);
    } else {
      console.log("  No footer data found");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkFooterColumns();

