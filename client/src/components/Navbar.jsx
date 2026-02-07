import { Link } from "react-router-dom";

export default function Navbar({ onLoginClick, onSignupClick }) {
  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <h1 className="text-3xl font-bold text-[#ffa500] cursor-pointer">
        <Link to="/" >
          StudySync
        </Link>
      </h1>

      <div className="flex gap-4 border-2 rounded-full p-4 border-amber-300 font-bold ">
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
