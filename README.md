# Node/Express Server with Modern React API

## Overview
This project is a full-stack web application featuring a Node.js and Express server with a modern front-end built using React, TypeScript, Vite, and Material-UI. It demonstrates how to create a robust API and integrate it seamlessly with a responsive, elegant front-end.

## Features
- **Express Server**: Handles API requests and integrates with external data sources.
- **Modern Front-End**: Built with React, TypeScript, and Material-UI for an elegant, responsive design.
- **Fast Development Workflow**: Uses Vite for speedy builds and hot module replacement.
- **API Integration**: Demonstrates fetching data from external APIs and serving it to the front-end.

## Prerequisites
- **Node.js** (v16 or later)
- **npm** (v7 or later) or **yarn**

## Installation

1. **Clone the Repository**:
    ```bash
    git clone https://greig4444@bitbucket.org/greig4444/react-express-server-api.git
    cd react-express-server-api
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the Application

Start both the React development server and Express server:
```bash
npm run dev
```


## Test the Application with Jest

```bash
npm run test
```

## CI/CD Pipeline Overview
This project uses a GitHub Actions pipeline to automate our continuous integration and delivery process. The pipeline is triggered on every push and pull request to the main branch. Here’s what each step does:

install-dependencies: Purpose: Checks out the repository, sets up Node.js (v18), and installs the project dependencies. Details:

Caches npm modules to speed up subsequent builds.

Installs additional ESLint and TypeScript-related packages for static code analysis.

Provides a debug step to confirm module installation.

lint-and-test: Purpose: Runs automated linting and testing jobs in parallel for improved code quality. Details:

Lint Job: Executes ESLint over the repository to enforce code style and conventions.

Test Job: Runs our Jest test suite to ensure that unit tests pass and code coverage requirements are met.

upload-coverage: Purpose: Uploads test coverage reports to Codecov so we can monitor test performance over time. Details:

This job is triggered after linting and testing, ensuring that coverage is only uploaded if the previous steps pass.

audit: Purpose: Runs npm audit to check for known vulnerabilities in production dependencies. Details:

Helps maintain security by ensuring no critical dependency issues exist.

This pipeline helps catch errors and security issues early in the development cycle, ensuring high standards for the code that goes into production.