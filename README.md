# Blockchain-Based Voting System with Face Recognition

A web-based voting system that implements two-factor authentication using both password and face recognition for enhanced security.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/voting-system.git
cd voting-system
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The backend server will start on http://localhost:3001

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:5173

## Using the Application

1. Register a New Account:
   - Click on "Register" button
   - Fill in your details
   - Allow camera access when prompted
   - Look at the camera and click "Capture Face"
   - Submit the registration form

2. Login:
   - Enter your email and password
   - Click "Verify Credentials"
   - Allow camera access for face verification
   - Look at the camera for face verification
   - Upon successful verification, you'll be logged in

## Security Features

- Face recognition using face-api.js
- Secure password handling
- Two-factor authentication
- Face data stored as numerical descriptors (not actual images)
- Server-side face verification

## Troubleshooting

1. Face Recognition Issues:
   - Ensure good lighting conditions
   - Position your face clearly in front of the camera
   - Make sure you've granted camera permissions
   - Try refreshing the page if the models don't load

2. Connection Issues:
   - Verify MongoDB is running
   - Check if all ports are available (3001 for backend, 5173 for frontend)
   - Ensure you have a stable internet connection

## Technology Stack

- Frontend:
  - React.js
  - Vite
  - face-api.js for face recognition
  - Bootstrap for UI
  - Axios for API calls

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - CORS for cross-origin requests
