import React from "react";
import { FiUploadCloud, FiZap, FiTrendingUp } from "react-icons/fi";

function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden pt-16">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        {/* Floating Icons */}
        <div className="hidden lg:block">
          <FiUploadCloud className="absolute top-20 left-10 text-primary/30 text-6xl animate-float" />
          <FiZap
            className="absolute top-32 right-20 text-purple-500/30 text-5xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <FiTrendingUp
            className="absolute bottom-20 right-10 text-indigo-500/30 text-6xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="animate-fadeIn">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary/20 mb-8 animate-scaleIn">
            <span className="text-primary text-sm font-semibold">
              ✨ New: Real-time Data Processing
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl animate-slideInLeft">
            <span className="block mb-2">Advanced CSV Data</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-slideInRight">
              Processing Made Simple
            </span>
          </h1>

          <p
            className="mt-6 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            Upload your CSV files and get instant insights with our powerful
            data processing tools.
            <span className="block mt-2 font-semibold text-gray-900">
              Clean, analyze, and visualize your data in seconds.
            </span>
          </p>

          <div
            className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <a
                href="#upload"
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-primary hover:bg-primary-dark hover:scale-105 transition-all duration-300 md:py-4 md:text-lg md:px-10 gap-2 shadow-md"
              >
                <FiUploadCloud className="text-xl" />
                Get Started
              </a>
            </div>
            <div className="mt-3 rounded-xl shadow-lg sm:mt-0 sm:ml-4 hover:shadow-2xl transition-all duration-300">
              <a
                href="#features"
                className="w-full flex items-center justify-center px-8 py-4 border-2 border-primary text-base font-bold rounded-xl text-primary bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 md:py-4 md:text-lg md:px-10"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Stats Section */}
          <div
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto animate-fadeIn"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-gray-600 mt-1">Files Processed</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-pink-500 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl font-bold text-pink-600">&lt;5s</div>
              <div className="text-sm text-gray-600 mt-1">Processing Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
