
# Chat-App

A real-time chat application built using Node.js and npm packages. This project demonstrates how to create a robust, scalable chat platform suitable for learning and production use.

## Features

- Real-time messaging between users
- User authentication using JWT
- Responsive UI 
- Scalable backend with Node.js

## Technologies Used

- **Backend:** Node.js (with Express.js)
- **Package Manager:** npm
- **WebSockets:** Socket.IO
- **Database:** MongoDB
- **Frontend:** React.js
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js (v14 or newer recommended)
- npm
- (Database server, e.g. MongoDB)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satyam-trimale/Chat-App.git
   cd Chat-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or, if separate backend/frontend folders:
   cd Backend && npm install
   cd ../Frontend && npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the appropriate directory (root/Backend)
   - Example:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/chat-app
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the application:**
   - Backend:
     ```bash
     cd Backend
     npm start
     ```
   - Frontend (if applicable):
     ```bash
     cd ../Frontend
     npm start
     ```

5. **Visit the app:**
   - Open your browser and go to `http://localhost:3000` (or the configured port)

## Usage

- Register or log in
- Start a new chat 
- Send and receive messages in real-time

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request



## Contact

Created by [satyam-trimale](https://github.com/satyam-trimale) — feel free to reach out!
