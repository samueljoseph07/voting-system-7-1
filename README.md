# Secure Voting System with Face Recognition

A web-based voting system that implements two-factor authentication using both password and face recognition for enhanced security.

## Features

- User registration with face capture
- Secure login with two-factor authentication:
  - Password verification
  - Face recognition verification
- Blockchain-based voting system
- Modern and responsive UI using Bootstrap

## Prerequisites

Before running this project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- A modern web browser (Chrome, Firefox, or Edge recommended)
- Webcam access for face recognition

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

## Configuration

1. Backend MongoDB Configuration:
   - Open `backend/index.js`
   - Replace the MongoDB connection URL with your own:
```javascript
mongoose.connect("your-mongodb-connection-string");
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
   - Try refreshing the page if models don't load

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
