#!/usr/bin/env node
const { spawn } = require('node:child_process');
const args = process.argv.slice(2);
if (args[0] === 'dev') {
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
  child.on('exit', code => process.exit(code ?? 0));
} else {
  const child = spawn('npx', ['next', 'start', ...args], { stdio: 'inherit', shell: true });
  child.on('exit', code => process.exit(code ?? 0));
}


