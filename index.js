#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function createFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️  Skipped (already exists): ${filePath}`);
  }
}

function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`✅ Created directory: ${folderPath}`);
  } else {
    console.log(`⚠️  Skipped (already exists): ${folderPath}`);
  }
}

function init() {
  createFile("default.json", "[]");
  createFile("mockServer.config.json", "{}");
  createFolder("defaultMocks");
  createFile(
    "ftmocks.env",
    `MOCK_DIR=./
PORT=5000
PREFERRED_SERVER_PORTS=[6080]
`
  );
  const envPath = path.join(process.cwd(), "ftmocks.env");
  let setupReadmeContent = fs.readFileSync(
    path.join(__dirname, "SETUP_README.md"),
    "utf8"
  );
  setupReadmeContent = setupReadmeContent.replace(
    "npm start <path to env>",
    `npm start ${envPath}`
  );
  createFile("README.md", setupReadmeContent);
}

function runCommand(command, options = {}) {
  console.log(`▶️  ${command}`);
  execSync(command, { stdio: "inherit", ...options });
}

function setup() {
  const repoURL = "https://github.com/SodhanaLibrary/ftmocks-server.git";
  const folderName = "ftmocks-server";

  if (fs.existsSync(folderName)) {
    console.log(`⚠️  Folder '${folderName}' already exists. Skipping clone.`);
  } else {
    runCommand(`git clone ${repoURL}`);
  }

  const projectPath = path.join(process.cwd(), folderName);
  if (fs.existsSync(projectPath)) {
    process.chdir(projectPath);
    runCommand("npm install");
    runCommand("npm start");
  } else {
    console.error("❌ Setup failed: folder not found.");
  }
}

// Entry
const command = process.argv[2];

switch (command) {
  case "init":
    init();
    break;
  case "setup":
    setup();
    break;
  default:
    console.log("❓ Unknown command. Use 'init' or 'setup'.");
}
