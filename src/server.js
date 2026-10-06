const path = require('path');

// Ensure working directory is set to backend folder for relative assets & logs
const backendDir = path.resolve(__dirname, '..', 'backend');
try {
  process.chdir(backendDir);
} catch (_) {}

module.exports = require('../backend/src/server');
