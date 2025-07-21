# 🔒 Chat-App - A Secure End-to-End Encrypted Chat Application

A modern, real-time chat application with **end-to-end encryption** (E2EE), built using React, Node.js, Express, Socket.IO, and MongoDB. This project demonstrates secure, scalable, and privacy-focused messaging for learning and production use.

---

## ✨ Core Features

* **Real-Time Messaging**: Instantaneous message delivery using WebSockets (Socket.IO).
* **User Presence**: See which users are currently online.
* **Private & Secure**: All messages are end-to-end encrypted. The server has zero knowledge of the message content.
* **Modern UI**: A clean and responsive user interface built with React.
* **User Authentication**: Secure user registration and login system with JWT.

---

## 🛡️ Security Architecture: End-to-End Encryption (E2EE)

This project's primary focus is on user privacy. Unlike standard chat applications where the server can read message content, This chat-app ensures that only the sender and the intended recipient can decipher messages.

Here’s a high-level overview of the cryptographic protocol:

1.  **Key Generation**: Upon registration, a unique and permanent `secp256k1` key pair (public and private) is generated on the client-side.
2.  **Private Key Protection**: The user's private key is **never** sent to the server in plaintext. Instead, it is encrypted using a strong key derived from the user's password (using PBKDF2 with 100,000 iterations) and stored in the database.
3.  **Secure Login**: On login, the encrypted private key is sent to the client, where it is decrypted using the password the user just entered. The plaintext private key then lives securely in memory for the session.
4.  **Key Exchange**: When a chat is initiated, users exchange their public keys through the server.
5.  **Shared Secret Derivation**: Both users independently compute a shared secret using the Elliptic Curve Diffie-Hellman (ECDH) key exchange protocol. This secret is identical for both users but is never transmitted over the network.
6.  **Message Encryption**: Every message is encrypted using the powerful **AES-256-GCM** algorithm with the derived shared secret before being sent to the server.
7.  **Zero-Knowledge Server**: The backend only stores and relays encrypted blobs of data. It has no ability to read the message content or access users' private keys.

| Feature                  | Cryptographic Implementation        | Purpose                                            |
| ------------------------ | ----------------------------------- | -------------------------------------------------- |
| **Key Pair** | ECDH (secp256k1)                    | Establishes user's cryptographic identity.         |
| **Key Derivation** | PBKDF2 (SHA-256)                    | Creates a strong encryption key from a password.   |
| **Private Key Storage** | AES-256-GCM                         | Securely "backs up" the private key on the server. |
| **Message Encryption** | AES-256-GCM                         | Encrypts and decrypts the actual chat messages.    |


---

## 🛠️ Technologies Used

### **Backend**
* **Node.js**: JavaScript runtime environment
* **Express.js**: Web application framework for Node.js
* **MongoDB**: NoSQL database for storing users and messages
* **Mongoose**: Object Data Modeling (ODM) library for MongoDB
* **Socket.IO**: Real-time engine for bidirectional communication
* **JSON Web Token (JWT)**: For user authentication and authorization
* **File Uploads:** Multer, Cloudinary

### **Frontend**
* **React**: JavaScript library for building user interfaces
* **Axios**: Promise-based HTTP client for making API requests
* **Socket.IO Client**: For connecting to the real-time server
* **@noble/secp256k1 & @noble/hashes**: For performing client-side cryptographic operations


---

## ⚡ Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm
- MongoDB (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satyam-trimale/Chat-App.git
   cd Chat-App
   ```

2. **Install dependencies:**
   ```bash
   cd Backend
   npm install
   cd ../Frontend
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in `Backend/`:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/chat-app
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

4. **Start the application:**
   - **Backend:**
     ```bash
     cd Backend
     npm start
     ```
   - **Frontend:**
     ```bash
     cd ../Frontend
     npm run dev
     ```

5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 Usage

- **Sign Up:** Create a new account with a profile picture.
- **Log In:** Securely log in with your credentials.
- **Start Chatting:** Select a user and start sending encrypted messages in real time.
- **Log Out:** Securely end your session.

---

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## ⚠️ Security Notes

- **Private Key Security:** Your private key is encrypted with your password and never leaves your device unencrypted.
- **Password Reset:** If you forget your password, you will lose access to your encrypted messages.
- **Public Key Authenticity:** For maximum security, verify public keys out-of-band if possible.


## 👤 Author

Created by [satyam-trimale](https://github.com/satyam-trimale) — feel free to reach out!

---

**Tip:**  
For production, always use HTTPS and secure your environment variables.
