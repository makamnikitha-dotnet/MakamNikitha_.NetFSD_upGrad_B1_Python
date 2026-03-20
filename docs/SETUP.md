# Project Setup Guide

This guide describes how to run the **Multi-Page E-Learning Platform** locally on your machine.

## Prerequisites
- **A modern web browser**: Chrome, Firefox, or Edge.
- **Visual Studio Code**: Recommended for development.
- **Node.js**: Required to run the automated unit tests.

## Running the Application
1. **Open the project**: Open the root folder in VS Code.
2. **Launch with Live Server**:
    - Install the **Live Server** extension if not already installed.
    - Right-click `index.html` and select **Open with Live Server**.
    - The app will automatically open at `http://127.0.0.1:5500/index.html`.
3. **Navigate**: Use the sidebar and dashboard links to explore different pages.

## Running Unit Tests
Automated tests ensure the core quiz and storage logic is functioning correctly.
1. Open a terminal in the project root.
2. Run `npm install` to set up dependencies (only needed once).
3. Run `npm test` to execute the test suite.

## Development Tips
- **Resetting State**: To clear all saved progress, you can open the browser's developer tools (F12) -> Application -> Local Storage -> Right click and "Clear".
- **Responsive Design**: Use the browser's "Device Mode" (Ctrl+Shift+M) to test layout on mobile devices.
