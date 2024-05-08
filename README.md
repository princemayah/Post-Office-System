# Post Office System

This project develops  a Post Office System using Node.js, React, and MySQL. The system handles interactions between users and employees, package tracking, and manages updates through a web-based interface. Employing advanced web technologies, the system guarantees a robust and secure user experience.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Introduction

The Post Office System is designed to streamline the operations of postal services with a user-friendly and interactive front-end coupled with a strong server-side framework. It supports functionalities such as user authentication, package tracking, employee management, and real-time data updates, all secured with JSON Web Tokens (JWT).

## Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/princemayah/Post-Office-System.git
2. Install dependencies:
   ```bash
   cd post-office-system
   npm install
3. Set up the MySQL database by running the provided SQL scripts in the `postoffice.sql` file.
   ```bash
   mysql -u username -p database_name < postoffice.sql
   ```
   Replace username and database_name with your MySQL username and the name of your database. 
5. Start the server:
   ```bash
   node server.js
6. Launch the front-end by navigating to the `client` folder and running:
   ```bash
   npm start

## Features

- User Authentication: Secure login and registration for users and employees using JWT.
- Package Tracking: Users can track their packages with real-time updates.
- Employee Management: Admins can manage employee details, work hours, and roles.
- Dynamic Data Interaction: CRUD operations on data related to packages, users, and employees.
- Automated Triggers: Database triggers for maintaining consistent and up-to-date information.
- Secure Data Access: Protected routes and encrypted data exchanges ensure data integrity and confidentiality.

## Usage

After installation, navigate to `localhost:3000` in your web browser to access the user interface. Users can register or log in to track packages or manage their information. Employees can log in to access administrative features.

## Technologies Used

- Front-end: React, Axios
- Back-end: Node.js, Express, JWT
- Database: MySQL
