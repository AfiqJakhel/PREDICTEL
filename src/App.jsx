import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import BackgroundParticles from "./components/layout/BackgroundParticles";
import BackgroundBeams from "./components/layout/BackgroundBeams";
import HomePage from "./pages/HomePage";
import InputDataPage from "./pages/InputDataPage";
import ProcessingDataPage from "./pages/ProcessingDataPage";
import TestDataPage from "./pages/TestDataPage";
import VisualisasiDataPage from "./pages/VisualisasiDataPage";
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
        return <TestDataPage />;
      case "visualization":
        return <VisualisasiDataPage />;
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
