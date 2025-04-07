import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()


  const handleClick = () => setShow(!show);

  const submitLogin = async () => {
    if (!email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }
  
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Login successful:", data);
      toast.success("Login Successful");
      navigate("/chats"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    }
  };
  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full border border-gray-300 px-3 py-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={handleClick}
            className="absolute right-2 top-2 text-sm text-blue-500"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        <button
          onClick={submitLogin}
          className={`w-full py-2 mt-4 rounded text-white bg-blue-600 hover:bg-blue-700 transition`}
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have a account ?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
