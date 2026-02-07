import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";

export default function Footer() {
  return (
    <footer className="bg-[#ffa500] text-[#f5f5dc] flex flex-col md:flex-row items-center justify-between px-6 py-6 border-t border-black/10">

      {/* Left */}
      <div className="text-center md:text-left">
        <h3 className="font-bold text-lg text-black">
          2026 © StudySync
        </h3>
        <p className="text-sm font-medium text-black/60">
          Plan smarter. Study better.
        </p>
      </div>

      {/* Right - Social Links */}
      <div className="flex gap-4 mt-3 md:mt-0">
        <a
          href="https://github.com/Navadeep-bommarapu"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={githubLogo}
            alt="GitHub"
            className="w-8 cursor-pointer hover:scale-110 transition bg-white rounded-full p-[2px]"
          />
        </a>

        <a
          href="https://www.linkedin.com/in/navadeep-bommarapu-7b6102265/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={linkedinLogo}
            alt="LinkedIn"
            className="w-8 cursor-pointer hover:scale-110 transition bg-white rounded p-[2px]"
          />
        </a>
      </div>
    </footer>
  )
}
