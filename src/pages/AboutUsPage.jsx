import React from "react";
import { FiUser } from "react-icons/fi";
import { TeamFocusCards } from "../components/ui/TeamFocusCard";

function AboutUsPage() {
  const teamMembers = [
    {
      name: "Ahmad Fauzi",
      nim: "231152XXXX",
      role: "Full Stack Developer",
      github: "#",
      linkedin: "#",
      email: "ahmad@example.com",
    },
    {
      name: "Budi Santoso",
      nim: "231152XXXX",
      role: "Data Scientist",
      github: "#",
      linkedin: "#",
      email: "budi@example.com",
    },
    {
      name: "Citra Dewi",
      nim: "231152XXXX",
      role: "UI/UX Designer",
      github: "#",
      linkedin: "#",
      email: "citra@example.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiUser className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              ABOUT US
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tim pengembang PREDICTEL - Sistem Prediksi Customer Churn berbasis
            Machine Learning
          </p>
        </div>

        {/* Team Members Grid */}
        <TeamFocusCards members={teamMembers} />

        {/* Project Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl border-2 border-cyan-200 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tentang PREDICTEL
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              PREDICTEL adalah sistem prediksi customer churn berbasis Machine
              Learning yang dikembangkan untuk membantu bisnis mengidentifikasi
              pelanggan yang berpotensi berhenti menggunakan layanan. Sistem ini
              menggunakan algoritma machine learning untuk menganalisis data
              pelanggan dan memberikan prediksi yang akurat.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-cyan-600 font-semibold">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              Kelompok 8 - Akuisisi Data 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;

