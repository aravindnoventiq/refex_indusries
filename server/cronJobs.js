require('dotenv').config();
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Get the server directory path
const serverDir = __dirname;

// Function to run npm script
function runNpmScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`[${new Date().toISOString()}] Starting: npm run ${scriptName}`);
    
    exec(`npm run ${scriptName}`, {
      cwd: serverDir,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[${new Date().toISOString()}] Error running ${scriptName}:`, error);
        console.error('stderr:', stderr);
        reject(error);
        return;
      }
      
      console.log(`[${new Date().toISOString()}] Completed: npm run ${scriptName}`);
      if (stdout) console.log('stdout:', stdout);
      if (stderr) console.log('stderr:', stderr);
      resolve(stdout);
    });
  });
}

// Schedule cron job to run every day at 8:00 PM (20:00)
// Cron format: minute hour day month day-of-week
// 0 20 * * * means: at 20:00 (8 PM) every day
const stockCronJob = cron.schedule('0 20 * * *', async () => {
  console.log(`[${new Date().toISOString()}] ===== Starting scheduled stock data update =====`);
  
  try {
    // Run stock.js first
    await runNpmScript('stock');
    console.log(`[${new Date().toISOString()}] Stock script completed successfully`);
    
    // Wait a bit before running the next script
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run stockBse.js
    await runNpmScript('stockBse');
    console.log(`[${new Date().toISOString()}] StockBse script completed successfully`);
    
    console.log(`[${new Date().toISOString()}] ===== Scheduled stock data update completed =====`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ===== Error in scheduled stock data update =====`);
    console.error(error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Adjust timezone as needed
});

// Cron job is automatically started and will run daily at 8:00 PM

// Export for use in other files if needed
module.exports = {
  stockCronJob,
  runNpmScript
};

