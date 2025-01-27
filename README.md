# Second Brain Application Backend

## Description
- This project about second brain where user can store online links at a single place, and access it anywhere using internet connection.
- built with TypeScript and managed using npm. 
- dependencies: zod, bcrypt, jsonwebtoken, cors


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Installation
To get started with this project, clone the repository and install the dependencies using npm:

```bash
git clone https://github.com/shubh-kk/second-brain.git
npm install
```

## Usage
To run the project, use the following npm script:

```bash
npm run dev
```

This will compile the TypeScript code and start the application.

## Scripts
The following npm scripts are available:

- `npm build`: Compiles the TypeScript code and starts the application.
- `npm run dev`: Compiles the TypeScript code into JavaScript.

## Project Structure
The project structure is organized as follows:

```
second-brain/
├── dist/               # Javascript files
├── src/                # Source files
│   ├── index.ts        # Entry point of the application
│   ├── db.ts/          # Database Schema
│   ├── config.ts/      # JWT password
│   ├── utils.ts/       # random string generate
├── tsconfig.json       # TypeScript configuration
├── package.json        # npm configuration
└── README.md           # Project documentation
```
