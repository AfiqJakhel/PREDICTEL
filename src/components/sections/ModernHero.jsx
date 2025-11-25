import React, { useState } from "react";
import {
  FiUpload,
  FiTrendingUp,
  FiCheckCircle,
  FiDatabase,
  FiCpu,
  FiActivity,
  FiBarChart2,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

function ModernHero({ onNavigate }) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const caraMembaca = [
    {
      step: 1,
      icon: FiUpload,
      title: "Input Data Pelanggan",
      description:
        "Upload file CSV berisi data pelanggan dengan berbagai atribut seperti demografi, layanan, dan riwayat transaksi.",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      iconBg: "bg-cyan-500",
    },
    {
      step: 2,
      icon: FiCpu,
      title: "Processing Data",
      description:
        "Sistem memproses dan membersihkan data, menangani missing values, dan melakukan normalisasi untuk persiapan analisis.",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      step: 3,
      icon: FiActivity,
      title: "Latih Model ML",
      description:
        "Algoritma Logistic Regression dilatih menggunakan data historis untuk memprediksi kemungkinan customer churn.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-500",
    },
    {
      step: 4,
      icon: FiBarChart2,
      title: "Visualisasi & Hasil",
      description:
        "Tampilkan hasil prediksi dalam bentuk grafik dan tabel yang mudah dipahami dengan insight actionable.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
    },
  ];

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % caraMembaca.length);
  };

  const prevSlide = () => {
    setCurrentCarouselIndex(
      (prev) => (prev - 1 + caraMembaca.length) % caraMembaca.length
    );
  };

  const currentStep = caraMembaca[currentCarouselIndex];
  const StepIcon = currentStep.icon;

  // Drag handlers for mouse
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const dragEnd = e.clientX;
    const dragDiff = dragStart - dragEnd;

    // If dragged more than 50px, change slide
    if (Math.abs(dragDiff) > 50) {
      if (dragDiff > 0) {
        // Dragged left, go to next
        nextSlide();
      } else {
        // Dragged right, go to previous
        prevSlide();
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  return (
    <div className="hero-container">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-blob floating-blob-cyan top-20 left-20 w-96 h-96"></div>
        <div
          className="floating-blob floating-blob-blue top-40 right-20 w-80 h-80"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="floating-blob floating-blob-indigo bottom-20 left-1/2 w-96 h-96"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="hero-content">
        {/* Hero Section */}
        <div className="mb-16 animate-fadeIn">
          {/* Badge */}
          <div className="hero-badge">
            <FiTrendingUp className="text-lg" />
            <span>Sistem Prediksi Customer Churn</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            <span className="block text-gray-900 mb-2">SISTEM PREDIKSI</span>
            <span className="hero-title-gradient">CUSTOMER CHURN</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            Aplikasi analisis berbasis{" "}
            <span className="font-bold text-blue-600">Machine Learning</span>{" "}
            untuk memprediksi dan mencegah kehilangan pelanggan dengan akurasi
            tinggi menggunakan algoritma{" "}
            <span className="font-bold text-blue-600">Logistic Regression</span>
          </p>

          {/* CTA Button */}
          <button
            onClick={() => onNavigate && onNavigate("input")}
            className="hero-cta-button group"
          >
            <FiUpload className="text-xl group-hover:animate-bounce" />
            Mulai Input Data
          </button>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cara Kerja Card - Carousel */}
          <div className="card-primary animate-slideInLeft">
            <div className="flex items-center justify-between mb-6">
              <div className="card-header">
                <div className="card-icon">
                  <FiDatabase className="text-white text-2xl" />
                </div>
                <h2 className="card-title">Cara Kerja Sistem</h2>
              </div>

              {/* Step Indicator */}
              <div className="carousel-dots">
                {caraMembaca.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarouselIndex(index)}
                    className={`carousel-dot ${
                      index === currentCarouselIndex
                        ? "carousel-dot-active"
                        : "carousel-dot-inactive"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Carousel Content with Drag */}
            <div
              className="carousel-container"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div className="carousel-content">
                <div
                  className="carousel-slide animate-fadeIn"
                  key={currentCarouselIndex}
                >
                  {/* Large Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div
                        className={`w-24 h-24 bg-gradient-to-br ${currentStep.color} rounded-2xl flex items-center justify-center shadow-2xl`}
                      >
                        <StepIcon className="text-white text-5xl" />
                      </div>
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-lg border-3 border-gray-100">
                        {currentStep.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {currentStep.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed px-4">
                      {currentStep.description}
                    </p>
                  </div>

                  {/* Process Flow Indicator */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="font-semibold">
                      Tahap {currentStep.step} dari {caraMembaca.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={prevSlide}
                className="carousel-nav-button carousel-nav-prev"
              >
                <FiChevronLeft className="text-lg" />
                <span className="text-sm">Sebelumnya</span>
              </button>

              <button
                onClick={nextSlide}
                className="carousel-nav-button carousel-nav-next"
              >
                <span className="text-sm">Selanjutnya</span>
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          </div>

          {/* Tentang Sistem Card */}
          <div className="card-secondary hover:-translate-y-2 animate-slideInRight">
            <div className="card-header">
              <div
                className="card-icon"
                style={{
                  background:
                    "linear-gradient(to bottom right, #3b82f6, #4338ca)",
                }}
              >
                <FiTrendingUp className="text-white text-2xl" />
              </div>
              <h2 className="card-title">Tentang Sistem</h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <span className="font-semibold text-blue-600">
                  Sistem prediksi customer churn
                </span>{" "}
                adalah platform berbasis Machine Learning yang dirancang untuk
                membantu perusahaan mengidentifikasi pelanggan yang berisiko
                berhenti menggunakan produk atau layanan.
              </p>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border-l-4 border-cyan-500">
                <p className="leading-relaxed">
                  Sistem ini menggunakan algoritma{" "}
                  <span className="font-bold text-blue-600">
                    Logistic Regression
                  </span>{" "}
                  yang lebih efektif dengan 18 fitur penting meliputi data
                  demografi, riwayat layanan, dan pola penggunaan pelanggan.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FiCheckCircle className="text-green-500" />
                <span className="font-semibold">Akurasi hingga 99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-3 gap-6 mt-12 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="stats-card stats-card-cyan">
            <div className="stats-number stats-number-cyan">99.9%</div>
            <div className="stats-label">Akurasi</div>
          </div>
          <div className="stats-card stats-card-blue">
            <div className="stats-number stats-number-blue">18+</div>
            <div className="stats-label">Fitur Data</div>
          </div>
          <div className="stats-card stats-card-indigo">
            <div className="stats-number stats-number-indigo">&lt;3s</div>
            <div className="stats-label">Waktu Proses</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernHero;
