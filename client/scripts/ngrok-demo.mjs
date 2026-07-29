/**
 * Expose the local Vite dev server (port 3000) via ngrok for client demos.
 *
 * Usage:
 *   set NGROK_AUTHTOKEN=your_token
 *   npm run demo:tunnel
 *
 * Get a free token: https://dashboard.ngrok.com/get-started/your-authtoken
 */
import ngrok from '@ngrok/ngrok';

const PORT = 3000;
const authtoken = process.env.NGROK_AUTHTOKEN;

if (!authtoken) {
  console.error('\nMissing NGROK_AUTHTOKEN.');
  console.error('1. Sign up at https://ngrok.com');
  console.error('2. Copy your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken');
  console.error('3. Run:  $env:NGROK_AUTHTOKEN="YOUR_TOKEN"; npm run demo:tunnel\n');
  process.exit(1);
}

try {
  const session = await new ngrok.SessionBuilder().authtoken(authtoken).connect();
  const listener = await session
    .httpEndpoint()
    .poolingEnabled(true)
    .listenAndForward(`http://localhost:${PORT}`);

  const url = listener.url();
  console.log('\n========================================');
  console.log('  Refex client demo (ngrok)');
  console.log('========================================');
  console.log(`  Public URL: ${url}`);
  console.log(`  Local:      http://localhost:${PORT}`);
  console.log('========================================');
  console.log('Keep this terminal open while sharing the demo.\n');

  setInterval(() => {}, 60_000);
} catch (err) {
  console.error('Failed to start ngrok tunnel:', err?.message || err);
  if (String(err?.message || err).includes('ERR_NGROK_334')) {
    console.error('\nYour ngrok dev domain is already in use by another session.');
    console.error('Stop it at https://dashboard.ngrok.com/tunnels/agents then run again.\n');
  }
  process.exit(1);
}
