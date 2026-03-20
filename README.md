# Multi-Page E-Learning Platform

A high-fidelity, client-side e-learning frontend built with standard web technologies. This project features a sophisticated dashboard, dynamic quiz systems, and full state persistence.

## 🚀 Key Features

### 📊 Advanced Learning Dashboard (v1.2.1)
- **Interactive Weekly Chart**: Visualize your study time over the last 7 days with hover-enabled bar charts.
- **Dynamic Progress Tracking**: Real-time "Courses In Progress" count and overall completion metrics.
- **Resume Learning**: Intelligent "Next Lesson" detection with a one-click resume button.
- **Achievements Grid**: 3-column metric display for courses completed, quizzes passed, and total points.

### 📝 Dynamic Quiz System
- **Asynchronous Loading**: Quizzes are rendered dynamically from a centralized data repository.
- **Instant Feedback**: Automated grading, percentage calculation, and pass/fail logic (70% threshold).
- **Smooth Navigation**: Hierarchical breadcrumbs and mobile-responsive layouts.

### 🔒 Data & State Management
- **Local Persistence**: Full project state tracking (Profile, Progress, Scores) using Browser Web Storage.
- **No Backend Required**: Pure client-side implementation for high performance.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), Bootstrap 5.3
- **Icons**: FontAwesome 6 (Solid & Regular)
- **Fonts**: Inter (via Google Fonts)
- **Testing**: Jest (Unit testing for core logic)
- **Design**: Modern "Premium" aesthetic with 3D illustrations and glassmorphism-lite accents.

## 📖 Documentation
Detailed technical information is available in the [docs/](docs/) folder:
- **[Architecture](docs/ARCHITECTURE.md)**: Technical overview and directory structure.
- **[Setup Guide](docs/SETUP.md)**: Local installation and testing instructions.
- **[Contributing](docs/CONTRIBUTING.md)**: Guidelines for working on this project.

## 🏁 Getting Started
1. **Clone or Download**: Download this project to your local machine.
2. **Launch**: Open `index.html` (or `Dashboard.html`) using a Live Server (like the VS Code Live Server extension).
3. **Explore**: Navigate between Courses, Quizzes, and your Profile to see state persistence in action.

## 🧪 Running Tests
This project includes a suite of unit tests for the core logic. To run them:
1. Ensure Node.js is installed.
2. Run `npm install` in the project root.
3. Execute `npm test`.

---
*Created by [Makam Nikitha](https://github.com/makamnikitha-dotnet) as part of the Multi-Page E-Learning Platform (Frontend) challenge.*
