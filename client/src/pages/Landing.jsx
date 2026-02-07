import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import AuthModal from "../components/AuthModal";
import AuthService from "../services/auth.service";
import { X } from "lucide-react";

import books from "../assets/books.png";
import progress from "../assets/progress.png";
import analysis from "../assets/analysis.png";
import reminder from "../assets/reminder.png";

export default function Landing() {
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      navigate("/app/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Navbar
        onLoginClick={() => setAuthModal("login")}
        onSignupClick={() => setAuthModal("signup")}
      />

      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === "login" ? "signup" : "login")}
        />
      )}



      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center h-[70vh] px-6">
        <p className="text-[2.5rem] md:text-[3.5rem] font-bold leading-tight ">
          StudySync helps <br />
          students to{" "}
          <span className="text-[#ffa500]">plan, track, analyse</span> <br />
          their study habits smartly
        </p>

        <button
          onClick={() => setAuthModal("login")}
          className="mt-10 bg-primary text-black font-bold px-10 py-3 rounded bg-[#ffa500]"
        >
          Get Started
        </button>
      </section>

      {/* FEATURES */}
      <section className="bg-[#ffa500] mx-6 md:mx-16 rounded-3xl py-20 flex flex-col justify-center text-center">
        <h2 className="text-[2.5rem] md:text-[3.5rem] text-[#fff8e1] font-bold mb-16 px-4">
          Why Choose StudySync?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12">
          <FeatureCard
            icon={books}
            title="Subject Management"
            description="Organize all your courses, topics, and study materials in one intuitive dashboard."
          />
          <FeatureCard
            icon={progress}
            title="Smart Study Timer"
            description="Stay focused with our built-in Pomodoro timer and Stopwatch to track every second."
          />
          <FeatureCard
            icon={analysis}
            title="Visual Analytics"
            description="Visualize your study habits with beautiful charts and gain insights to improve efficiency."
          />
          <FeatureCard
            icon={reminder}
            title="Weekly Planning"
            description="Plan your week ahead with our smart calendar to ensure you never miss a deadline."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-gray-800">How StudySync Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-1 bg-[#fff8e1] -z-0"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#fff8e1] rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
                <span className="text-4xl font-bold text-[#ffa500]">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Set Your Subjects</h3>
              <p className="text-gray-500 leading-relaxed">Input your courses and topics to create a personalized dashboard tailored to your curriculum.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#fff8e1] rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
                <span className="text-4xl font-bold text-[#ffa500]">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Plan Your Schedule</h3>
              <p className="text-gray-500 leading-relaxed">Use our smart calendar to organize study sessions and never miss a deadline again.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#fff8e1] rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
                <span className="text-4xl font-bold text-[#ffa500]">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Track & Improve</h3>
              <p className="text-gray-500 leading-relaxed">Log your study time, visualize progress, and turn productive habits into a streak.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#ffa500] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl hover:shadow-2xl transition duration-500">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to Master Your Studies?
          </h2>
          <p className="text-[#fff8e1] text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of students who are organizing their academic life and achieving higher grades with StudySync.
          </p>
          <button
            onClick={() => setAuthModal("signup")}
            className="bg-white text-[#ffa500] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 transition shadow-lg relative z-10"
          >
            Start for Free Today
          </button>
        </div>
      </section>


      <Footer />
    </>
  );
}
