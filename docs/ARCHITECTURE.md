# Project Architecture

This document provides a high-level overview of the **Multi-Page E-Learning Platform** frontend architecture.

## Technological Stack
- **Structure**: Semantic HTML5 for all pages.
- **Styling**: Vanilla CSS3 with Bootstrap 5.3 for responsive layouts and utility classes.
- **Logic**: Vanilla JavaScript (ES6+) for dynamic rendering and state management.
- **Icons & Fonts**: FontAwesome 6 and Google Fonts (Inter).
- **Testing**: Jest framework for verifying core logic and data processing.

## Directory Structure
- `/assets`: Images, illustrations, and static media.
- `/css`: Stylesheets, including `style.css` for custom components.
- `/js`: Logic layer.
    - `app.js`: Main application entry and UI orchestration.
    - `storage.js`: LocalStorage wrapper for persistent user state.
    - `data.js`: Centralized data store for courses and quizzes.
- `/tests`: Unit tests for critical functions.
- `/docs`: Detailed project documentation.

## Core Systems
1. **Dynamic Quiz Engine**: Renders questions from JSON-like objects in `data.js`, calculates scores, and provides instant feedback.
2. **Persistence Layer**: All user progress (courses started, quiz scores, profile data) is saved to the browser's `localStorage` to ensure data remains consistent across page reloads.
3. **Responsive Dashboard**: Uses a grid-based layout to adapt to different screen sizes, featuring interactive charts for study time tracking.
