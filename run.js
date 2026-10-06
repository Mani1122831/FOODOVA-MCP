const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[33m%s\x1b[0m', '══════════════════════════════════════════════════════════════════');
console.log('\x1b[1m\x1b[36m%s\x1b[0m', '  🍔 STARTING FOODOVA (BACKEND + FRONTEND) IN UNIFIED MODE');
console.log('\x1b[33m%s\x1b[0m', '══════════════════════════════════════════════════════════════════');

// Backend Process
const backendPath = path.join(__dirname, 'backend');
const backend = spawn('npm.cmd', ['run', 'dev'], {
  cwd: backendPath,
  shell: true,
  stdio: 'pipe'
});

// Frontend Process
const frontendPath = path.join(__dirname, 'frontend');
const frontend = spawn('npm.cmd', ['run', 'dev'], {
  cwd: frontendPath,
  shell: true,
  stdio: 'pipe'
});

// Color formatted logger
const formatLog = (prefix, colorCode, data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${colorCode}[${prefix}]\x1b[0m ${line}`);
    }
  });
};

backend.stdout.on('data', data => formatLog('BACKEND :5000', '\x1b[35m', data));
backend.stderr.on('data', data => formatLog('BACKEND ERR', '\x1b[31m', data));

frontend.stdout.on('data', data => formatLog('FRONTEND :5173', '\x1b[36m', data));
frontend.stderr.on('data', data => formatLog('FRONTEND ERR', '\x1b[31m', data));

const cleanup = () => {
  console.log('\n\x1b[33mShutting down FOODOVA services...\x1b[0m');
  try { backend.kill('SIGINT'); } catch (e) {}
  try { frontend.kill('SIGINT'); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
