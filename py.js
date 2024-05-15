'use strict';

import path from "node:path";
import fs from "node:fs";
import { spawn, execFile } from "node:child_process";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VENV_PATH = path.join(__dirname, "venv");
const SCRIPTS_PATH = path.join(__dirname, "venv", "Scripts");
const PYTHON_PATH = path.join(__dirname, "venv", "Scripts", "python.exe");
const PIP_PATH = path.join(__dirname, "venv", "Scripts", "pip.exe");
const ACTIVATE_PATH = path.join(__dirname, "venv", "Scripts", "activate.bat");
const DEACTIVATE_APTH = path.join(__dirname, "venv", "Scripts", "deactivate.bat");

function S(filePath, args) {
  return new Promise(function(resolve, reject) {
    let stdout = "";
    let stderr = "";
  
    const child = spawn(filePath, args);
  
    child.stdout.on("data", function(data) {
      stdout += data.toString();
    });
  
    child.stderr.on("data", function(data) {
      stderr += data.toString();
    });
  
    child.on("error", function(err) {
      reject(err);
    });
  
    child.on('exit', function(code, signal) {
      resolve({stdout, stderr})
    });
  });
}

function E(filePath, args) {
  return new Promise(function(resolve, reject) {
    execFile(filePath, args, function(err, stdout, stderr) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function venv(force) {
  // clear venv dir
  if (force && fs.existsSync(VENV_PATH)) {
    fs.rmSync(VENV_PATH, { force: true, recursive: true, });
  }

  // create venv dir
  if (!fs.existsSync(VENV_PATH)) {
    fs.mkdirSync(VENV_PATH);

    // create venv
    return await S("python", ["-m", "venv", VENV_PATH ]);
  }
}

async function install(modulePath, args) {
  if (!fs.existsSync(VENV_PATH)) {
    throw new Error(`${VENV_PATH} not exists.`);
  }
  if (!fs.existsSync(SCRIPTS_PATH)) {
    throw new Error(`${SCRIPTS_PATH} not exists.`);
  }
  if (!fs.existsSync(PIP_PATH)) {
    throw new Error(`${PIP_PATH} not exists.`);
  }

  // install to venv
  return await S(PIP_PATH, ["install", modulePath].concat(args || []));
}

// execute python script
async function execute(scriptPath, args) {
  if (fs.existsSync(PYTHON_PATH)) {
    return await S(PYTHON_PATH, [scriptPath].concat(args || []));
  } else {
    return await S("python", [scriptPath].concat(args || []));
  }
}

// esm
export default {
  venv,
  install,
  execute,
  exec: execute,
}
