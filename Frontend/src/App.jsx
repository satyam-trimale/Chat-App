import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Chat from "./Pages/Chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <SocketProvider>
      <ChatProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/chats" element={<Chat />}></Route>
          </Routes>
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </ChatProvider>
    </SocketProvider>
  );
}

export default App;
