/**
 * REFEX Renewables Daily Cron - Fetches today's BSE data every day at 8 PM
 */
const { CronJob } = require('cron');
const { spawn } = require('child_process');
const path = require('path');

// Run every day at 10:05 AM IST (second minute hour day month weekday)
const CRON_SCHEDULE = '0 5 10 * * *'; // 10:05 AM daily

function runRefexRenewToday() {
  const scriptPath = path.join(__dirname, 'stockRefexRenewBse.js');
  const child = spawn('node', [scriptPath, '--today'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', (d) => {
    stdout += d.toString();
  });
  child.stderr?.on('data', (d) => {
    stderr += d.toString();
  });

  child.on('close', (code) => {
    const time = new Date().toISOString();
    if (code === 0) {
      console.log(`[${time}] REFEXRENEW daily fetch completed successfully`);
    } else {
      console.warn(`[${time}] REFEXRENEW daily fetch exit code ${code}:`, stderr || stdout);
    }
  });
}

let job = null;

function startRefexRenewCron() {
  if (job) return job;
  job = new CronJob(CRON_SCHEDULE, runRefexRenewToday, null, true, 'Asia/Kolkata');
  console.log('📅 REFEXRENEW cron: Daily 10:05 AM (IST) - enabled');
  return job;
}

function stopRefexRenewCron() {
  if (job) {
    job.stop();
    job = null;
    console.log('REFEXRENEW cron stopped');
  }
}

module.exports = {
  startRefexRenewCron,
  stopRefexRenewCron,
  runRefexRenewToday
};
