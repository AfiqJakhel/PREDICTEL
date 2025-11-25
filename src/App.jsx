import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import BackgroundParticles from "./components/layout/BackgroundParticles";
import BackgroundBeams from "./components/layout/BackgroundBeams";
import HomePage from "./pages/HomePage";
import InputDataPage from "./pages/InputDataPage";
import ProcessingDataPage from "./pages/ProcessingDataPage";
import AboutUsPage from "./pages/AboutUsPage";
import { DataProvider } from "./contexts/DataContext";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "input":
        return <InputDataPage />;
      case "processing":
        return <ProcessingDataPage />;
      case "test":
        return (
          <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Test Data</h1>
                <p className="text-gray-600 mt-2">
                  Halaman ini sedang dalam pengembangan
                </p>
              </div>
            </div>
          </div>
        );
      case "visualization":
        return (
          <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Data Visualization
                </h1>
                <p className="text-gray-600 mt-2">
                  Halaman ini sedang dalam pengembangan
                </p>
              </div>
            </div>
          </div>
        );
      case "about":
        return <AboutUsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen flex bg-gray-50 relative">
        {/* Animated Background Effects */}
        <BackgroundBeams />
        <BackgroundParticles />

        {/* Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 relative z-10 ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          {renderPage()}
          <Footer sidebarCollapsed={sidebarCollapsed} />
        </main>
      </div>
    </DataProvider>
  );
}

export default App;
