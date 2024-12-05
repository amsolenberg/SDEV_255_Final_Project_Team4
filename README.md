# SDEV 255 Final Project: Online School Registration System

This repository contains the source code for an Online School Registration System, developed as the final project for SDEV 255 by Team 4. The application supports course management, user authentication, student enrollments, and a shopping cart feature for students.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This web-based system enables students to enroll in courses, faculty to manage their assigned courses, and both groups to access personalized features through a secure login system. The system is built with modern web technologies and provides a clean user interface for easy navigation.

## Features

### General
- **User Authentication**:
  - Register as a student or faculty member.
  - Login and logout functionality with session management.
  - Secure password handling with hashing.
- **Dynamic Role-Based Views**:
  - Different dashboards for students and faculty.

### Students
- View all available courses.
- Add courses to a shopping cart for later enrollment.
- Enroll in courses from the shopping cart.
- Remove courses from the shopping cart.
- Manage enrolled courses from their profile page.

### Faculty
- Manage courses (add, edit, delete).
- Assign themselves as instructors to courses or assign other faculty members.
- View assigned courses and associated enrolled students.
- Prevented from deleting courses they did not create.

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
- **Frontend**:
  - EJS for server-side rendering
  - Bootstrap for styling
- **Authentication**:
  - Express-session for session management
  - bcryptjs for password hashing
- **Deployment**:
  - Docker (optional)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/amsolenberg/SDEV_255_Final_Project_Team4.git
cd SDEV_255_Final_Project_Team4
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/online-registration
SESSION_SECRET=your_secret_key
```

### 4. Start the Application

```bash
npm start
```

### 5. Access the Application

Visit http://localhost:3000 in your browser

## Usage Guide

### Students

1. Register an account as a student.
2. Log in and navigate to the "Available Courses" page to view courses.
3. Add courses to the shopping cart by clicking the "Add to Cart" button.
4. Navigate to the "Cart" page to manage courses in the cart or proceed to enrollment.
5. Enroll in selected courses directly from the cart.
6. Manage enrolled courses from your profile page.

### Faculty

1. Register an account as a faculty member.
2. Log in and navigate to the "Manage Courses" page to add, edit, or delete courses.
3. Assign yourself to courses or manage existing assignments.
4. Prevent deletion of courses created by other faculty members.

## Project Structure

```plaintext
.
├── env/                  # Environment variable files
├── middleware/           # Middleware functions
├── models/               # Mongoose schemas
├── node_modules/         # Node.js dependencies
├── public/               # Static assets
├── routes/               # Express routes
├── scripts/              # Utility scripts
├── views/                # EJS templates for server-side rendering
├── app.js                # Main application entry point
├── db.js                 # Database connection logic
├── docker-compose.yml    # Docker setup
├── LICENSE               # License information
├── package.json          # Node.js dependencies
├── package-lock.json     # Lockfile for Node.js dependencies
└── README.md             # Project documentation

```

## Contributing

1. Fork the repository on GitHub
2. Clone your forked repository:

```bash
git clone https://github.com/your_username/SDEV_255_Final_Project_Team4.git
```

3. Create a new branch for your feature:

```bash
git checkout -b feature/your_feature_name
```

4. Commit your changes:

```bash
git commit -m "Description of changes"
```

5. Push to your fork:

```bash
git push origin feature/your_feature_name
```

6. Submit a pull request to the main repository.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.