#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync, exec } = require("child_process");

function runCommandSync(command, options = {}) {
  console.log(`▶️  ${command}`);
  execSync(command, { stdio: "inherit", ...options });
}

function runCommandAsync(command, options = {}) {
  console.log(`▶️  ${command}`);
  exec(command, { stdio: "inherit", ...options });
}

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
  createFolder("ftmocks");
  process.chdir("ftmocks");
  createFile("mockServer.config.json", "{}");
  createFolder("defaultMocks");
  createFile("defaultMocks/_mock_list.json", "[]");
  createFile(
    "ftmocks.env",
    `MOCK_DIR=./
PORT=5000
PREFERRED_SERVER_PORTS=[6080]
PLAYWRIGHT_DIR=../playwright
FALLBACK_DIR=../public
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
  process.chdir("..");
}

function initPlaywright() {
  init();
  createFolder("playwright");
  process.chdir("playwright");
  runCommandSync("npm init playwright@latest");
  runCommandSync("npx playwright install");
  runCommandSync("npm install --save ftmocks-utils");
  process.chdir("..");
}

function setup(envPath) {
  const repoURL = "https://github.com/SodhanaLibrary/ftmocks-server.git";
  const folderName = "ftmocks-server";

  if (fs.existsSync(folderName)) {
    console.log(`⚠️  Folder '${folderName}' already exists. Skipping clone.`);
  } else {
    runCommandSync(`git clone ${repoURL}`);
  }

  const projectPath = path.join(process.cwd(), folderName);
  if (fs.existsSync(projectPath)) {
    process.chdir(projectPath);
    runCommandSync("npm install");
    runCommandSync("npx playwright install");
    runCommandAsync(`npm start ${envPath || "my-project.env"}`);
    process.chdir("..");
    setTimeout(() => {
      runCommandAsync(`open http://localhost:5000/`);
    }, 1000);
  } else {
    console.error("❌ Setup failed: folder not found.");
  }
}

function setupExamples() {
  const repoURL = "https://github.com/SodhanaLibrary/ftmocks-examples.git";
  const folderName = "ftmocks-examples";

  if (fs.existsSync(folderName)) {
    console.log(`⚠️  Folder '${folderName}' already exists. Skipping clone.`);
  } else {
    runCommandSync(`git clone ${repoURL}`);
  }
}

function initPlaywrightAll() {
  initPlaywright();
  setup("../ftmocks/ftmocks.env");
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
  case "setup-examples":
    setupExamples();
    break;
  case "init-playwright":
    initPlaywright();
    break;
  case "init-playwright-all":
    initPlaywrightAll();
    break;
  default:
    console.log("❓ Unknown command. Use 'init' or 'setup'.");
}
