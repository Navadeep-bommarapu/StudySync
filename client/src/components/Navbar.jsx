import { Link } from "react-router-dom";

export default function Navbar({ onLoginClick, onSignupClick }) {
  return (
    <nav className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#ffa500] cursor-pointer">
        <Link to="/" >
          StudySync
        </Link>
      </h1>

      <div className="flex gap-3 md:gap-4 border md:border-2 rounded-full px-3 py-2 md:p-4 border-amber-300 font-bold text-sm md:text-base">
        <button onClick={onLoginClick} className="font-semibold text-primary cursor-pointer">
          Login
        </button>
        <button onClick={onSignupClick} className="font-semibold text-primary cursor-pointer">
          Sign up
        </button>
      </div>
    </nav>
  );
}
