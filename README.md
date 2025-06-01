# Linkwith: Professional URL Management Platform


## Overview

Linkwith is an advanced URL shortening and analytics platform that transforms long URLs into concise, trackable links. Built with modern web technologies, it provides comprehensive analytics, QR code generation, and detailed insights into link performance, making it an ideal solution for marketing professionals, content creators, and businesses.

## Key Features

### Authentication & Security

- Secure email-based authentication system
- JWT-powered session management
- Password recovery with email verification
- Protected routes and authenticated dashboards

### Link Management

- Custom URL shortening with unlimited usage
- Instant QR code generation
- Bulk URL management capabilities
- Custom link expiration settings

### Analytics Dashboard

- Real-time click tracking and analytics
- Comprehensive metrics including:
  - Total vs. unique clicks
  - Geographic distribution
  - Device and browser analytics
  - Peak usage hours
  - 30-day trend analysis
- Exportable reports and data visualization

## Technology Stack

### Backend Infrastructure

- **Server**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcrypt.js
- **Email Service**: Nodemailer
- **Security**: CORS, Cookie-parser

### Frontend Architecture

- **Framework**: React 18
- **Routing**: React Router DOM v7
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **3D Effects**: Three.js
- **UI Components**: Lucide React
- **Network**: Axios
- **Testing**: Jest & React Testing Library

## Installation Guide

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git


### Setup Instructions

Follow these steps to set up and run the **Linkwith** application locally.

#### 1. Clone the Repository

Clone the repository from GitHub and navigate to the project directory:

```bash
git clone https://github.com/IamDevTrivedi/linkwith.git
cd linkwith
```

#### 2. Install Dependencies

Install all required dependencies for both the client and server:

```bash
npm run init
```

> **Note**: Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

#### 3. Configure Environment Variables

Create `.env` files for both the client and server by copying the provided example files:

- For the **client**:
  ```bash
  cp client/.env.example client/.env
  ```
- For the **server**:
  ```bash
  cp server/.env.example server/.env
  ```

Update the `.env` files with the required variables specific to your platform (e.g., API keys, database URLs, or other credentials). Refer to the documentation or platform for the correct values.

#### 4. Start the Development Server

Launch both the client and server in development mode from the root directory:

```bash
npm run go
```

> **Note**: This command starts both the frontend and backend servers concurrently.

#### 5. Access the Application

Once the servers are running, you can access the application at the following URLs:

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

> **Tip**: Ensure no other applications are using ports `3000` or `5000`. If you encounter issues, check for port conflicts and update the `.env` files if necessary.


## Deployment

The application is deployed and accessible at [linkwith.vercel.app](https://linkwith.vercel.app)

### Deployment Prerequisites

- Vercel account for frontend deployment
- Render account for backend deployment
- MongoDB Atlas account for database
- SMTP service provider credentials


## Author

**Dev Trivedi**

- GitHub: [@IamDevTrivedi](https://github.com/IamDevTrivedi)
- LinkedIn: [Dev Trivedi](https://www.linkedin.com/in/contact-devtrivedi/)


---

Made with ❤️ by [Dev Trivedi](https://github.com/IamDevTrivedi)
