import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-4xl font-bold font-[Work Sans] mb-4">Talk-A-Tive</h1>
        <p className="text-gray-600 mb-6">Connect with your friends instantly!</p>

        <div className="flex justify-between gap-4">
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition ">
            Login
          </Link>
          <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
