# FTMocks

A powerful mock server tool for creating and managing API mocks for testing. FTMocks provides a simple CLI to initialize mock projects and set up mock servers.

## 🚀 Quick Start

### Initialize a New Mock Project

```bash
npx ftmocks init
```

This command creates the following structure in your current directory:

```
.
├── default.json              # Default mock configurations
├── mockServer.config.json    # Mock server configuration
├── defaultMocks/            # Directory for default mock files
├── ftmocks.env              # Environment configuration
└── README.md                # This setup guide
```

### Setup ftmocks-server

```bash
npx ftmocks setup
```

Initialize a New Mock Project along with playwright:

```bash
npx ftmocks init-playwright
```

Initialize a New Mock Project along with playwright and ftmocks-server:

```bash
npx ftmocks init-playwright-all
```
