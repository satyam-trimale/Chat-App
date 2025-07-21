import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { encryptPrivateKey, generateKeys } from "../utils/crypto";

function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [pic, setPic] = useState(null);
  const navigate = useNavigate()


  const handleClick = () => setShow(!show);

  const postDetails = (file) => {
    if (!file) return;
    setPic(file);
  };
  

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmPassword || !pic) {
      toast.error("Please fill all the fields")
      return;
    }
  
    if (password !== confirmPassword) {
      toast.warning("Password don't match")
      return;
    }
  
    try {

      const {privateKey, publicKey} = generateKeys();
      // --- 2. ENCRYPT THE PRIVATE KEY WITH THE PASSWORD ---
      const {encryptedPrivateKey, salt, iv} = await encryptPrivateKey(privateKey,password);

      setPicLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("pic", pic); // Must match backend field name
      formData.append("publicKey",publicKey);
      formData.append("encryptedPrivateKey",encryptedPrivateKey);
      formData.append("privateKeySalt",salt);
      formData.append("privateKeyIv",iv);

  
      const { data } = await axios.post(
        "http://localhost:5000/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        // --- 4. STORE THE PLAINTEXT PRIVATE KEY FOR THE CURRENT SESSION ---
      localStorage.setItem(`privateKey_${data._id}`, privateKey);      
  
      toast.success("Registration suceessfull")
      setPicLoading(false);
      // maybe redirect to login page?
      navigate("/login")
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      setPicLoading(false);
    }
  };
  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
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
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full border border-gray-300 px-3 py-2 rounded"
                onChange={(e) => setConfirmpassword(e.target.value)}
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
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Upload your Picture
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </div>

          <button
            onClick={submitHandler}
            disabled={picLoading}
            className={`w-full py-2 mt-4 rounded text-white ${
              picLoading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {picLoading ? "Loading..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
