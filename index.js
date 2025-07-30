#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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
  const setupReadmeContent = fs.readFileSync(
    path.join(__dirname, "SETUP_README.md"),
    "utf8"
  );
  setupReadmeContent = setupReadmeContent.replace(
    "npm start <path to env>",
    `npm start ${envPath}`
  );
  createFile("README.md", setupReadmeContent);
}

init();
