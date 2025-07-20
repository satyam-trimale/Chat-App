# 🔒 Chat-App

A modern, real-time chat application with **end-to-end encryption** (E2EE), built using React, Node.js, Express, Socket.IO, and MongoDB. This project demonstrates secure, scalable, and privacy-focused messaging for learning and production use.

---

## 🚀 Features

- **End-to-End Encrypted Messaging:** All messages are encrypted on the client and can only be decrypted by the intended recipient.
- **User Authentication:** Secure registration and login with JWT.
- **Real-Time Communication:** Instant messaging using Socket.IO.
- **Modern UI:** Responsive, user-friendly interface built with React and Tailwind CSS.
- **Profile Avatars:** Upload and display user profile pictures.
- **Online Status:** See which users are online in real time.
- **Scalable Backend:** Built with Node.js, Express, and MongoDB.

---

## 🛡️ End-to-End Encryption Details

- **Key Generation:** Each user generates a public/private key pair on signup. The private key is encrypted with the user's password and stored securely.
- **Message Encryption:** Messages are encrypted with a shared secret derived from the sender's private key and the recipient's public key (ECDH + AES-GCM).
- **Zero Knowledge:** The server never sees plaintext messages or unencrypted private keys.
- **Forward Secrecy:** Each user pair has a unique shared secret.

---

## 🛠️ Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, React Router, React Toastify
- **Backend:** Node.js, Express.js, Socket.IO, MongoDB, Mongoose
- **Authentication:** JWT
- **Crypto:** ECDH (secp256k1), AES-GCM (WebCrypto API)
- **File Uploads:** Multer, Cloudinary

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
