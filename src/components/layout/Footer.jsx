import React from "react";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiDatabase,
} from "react-icons/fi";

function Footer({ sidebarCollapsed = false }) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FiGithub, href: "#", label: "GitHub" },
    { icon: FiTwitter, href: "#", label: "Twitter" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn" },
    { icon: FiMail, href: "#", label: "Email" },
  ];

  const footerLinks = [
    { name: "Tentang", href: "#" },
    { name: "Dokumentasi", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  return (
    <footer
      className="relative text-white border-t border-cyan-500/20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a1929 0%, #1e3a5f 25%, #0d2847 50%, #1e3a5f 75%, #0a1929 100%)",
        boxShadow:
          "0 0 0 1px rgba(6, 182, 212, 0.1), 0 -20px 25px -5px rgba(6, 182, 212, 0.15), 0 -5px 15px rgba(59, 130, 246, 0.1)",
      }}
    >
      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)`,
        }}
      ></div>

      <div className="relative z-10 max-w-[95%] mx-auto py-12 px-6 sm:px-8 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div className="text-left">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-75"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FiDatabase className="text-white text-2xl" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white block leading-tight">
                  PREDICTEL
                </span>
                <span className="text-xs text-cyan-300">Data Analytics</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Sistem prediksi customer churn berbasis Machine Learning yang
              akurat dan terpercaya untuk membantu bisnis Anda.
            </p>
          </div>

          {/* Blank Section */}
          <div className="text-left"></div>

          {/* Social Media */}
          <div className="text-left">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
              Connect With Us
            </h3>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="relative group w-11 h-11 flex items-center justify-center bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 text-cyan-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50"
                  >
                    <Icon className="text-xl relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </a>
                );
              })}
            </div>
            <p className="text-gray-400 text-xs mt-6">
              Ikuti kami untuk update terbaru dan insight menarik tentang data
              analytics.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear}{" "}
              <span className="text-white font-semibold">PREDICTEL</span> -
              Sistem Prediksi Customer Churn
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Active</span>
              </div>
              <span className="text-gray-600">|</span>
              <p className="text-xs text-cyan-300 font-medium">
                Kelompok 8 - Akuisisi Data 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
