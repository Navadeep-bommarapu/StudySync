import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffa500] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl w-full max-w-md p-10 text-center shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-[#ffa500] mb-2">Sign Up</h1>
        <p className="text-gray-500 mt-2 mb-8">
          Start planning your studies smarter
        </p>

        <form className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1">
            <label className="font-bold">Username:</label>
            <input
              className="border-2 border-[#ffa500] focus:outline-none focus:ring-2 focus:ring-[#ffa500] p-3 rounded-lg transition-colors w-full bg-white"
              placeholder="Ex. John Doe"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold">Email:</label>
            <input
              className="border-2 border-[#ffa500] focus:outline-none focus:ring-2 focus:ring-[#ffa500] p-3 rounded-lg transition-colors w-full bg-white"
              placeholder="johndoe@gmail.com"
              type="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold">Password:</label>
            <input
              className="border-2 border-[#ffa500] focus:outline-none focus:ring-2 focus:ring-[#ffa500] p-3 rounded-lg transition-colors w-full bg-white"
              placeholder="Create a password"
              type="password"
            />
          </div>
          <button className="bg-[#ffa500] text-black hover:bg-orange-500 hover:text-white transition py-3 rounded-lg font-bold mt-4">
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#ffa500] hover:underline">
            Login
          </Link>
        </p>

        <div className="mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-black transition">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
