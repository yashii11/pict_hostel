# HostelEase - PICT Hostel Management System

## Description

The PICT Hostel Management System is a comprehensive web application designed to streamline hostel operations at Pune Institute of Computer Technology (PICT). It offers distinct interfaces for students, wardens, and administrators, facilitating efficient management of hostel activities.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)

## Features

### Student Interface

- **Authentication**: Secure login and signup.
- **Profile Management**: Update personal information.
- **Mess Menu**: View daily meal offerings.
- **Notice Board**: Stay informed with the latest announcements.
- **Complaints**: Lodge and track grievances.
- **Leave Applications**: Submit and monitor leave requests.

### Warden Interface

- **Student Verification**: Approve or reject student registrations.
- **Profile Management**: Manage student profiles.
- **Mess Menu Management**: Update meal schedules.
- **Notice Board**: Post important announcements.
- **Complaint Resolution**: Address and resolve student complaints.
- **Leave Application Management**: Review and approve leave requests.

### Admin Interface

- **Comprehensive Management**: Oversee all aspects of the hostel system, including user roles and permissions.

## Screenshots

![Screenshot (1841)](https://github.com/user-attachments/assets/1fbaa16c-d6c0-4cb9-a834-7c90bb4aab4c)
![Screenshot (1842)](https://github.com/user-attachments/assets/ba834436-053a-4d3f-b788-763e2ff9f0b9)
![Screenshot (1843)](https://github.com/user-attachments/assets/4ae2de7c-00ad-40fb-abce-9a54aae70a80)
![Screenshot (1845)](https://github.com/user-attachments/assets/27409714-5854-40b5-ab2a-cfe9e0d97ec4)


## Tech Stack

- **Client**: Handlebars.js, CSS
- **Server**: Node.js, Express.js
- **Database**: MongoDB
- **Others**: Passport.js for authentication, Mongoose for MongoDB object modeling

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yashii11/pict_hostel.git
   cd pict_hostel
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     SESSION_SECRET=your_session_secret
     ```

4. **Start the Application**:
   ```bash
   npm start
   ```

   The application will run at `http://localhost:3000`.

## Usage

- **Student**:
  - Register and log in.
  - Update profile details.
  - View mess menu and notices.
  - Submit complaints and leave applications.

- **Warden**:
  - Log in to the warden portal.
  - Verify student registrations.
  - Manage profiles, mess menus, and notices.
  - Address complaints and leave applications.

- **Admin**:
  - Access the admin dashboard.
  - Oversee system-wide settings and user management.
