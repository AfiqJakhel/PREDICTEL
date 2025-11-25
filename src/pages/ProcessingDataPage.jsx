import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiRefreshCw, FiBarChart2 } from "react-icons/fi";
import { useData } from "../hooks/useData";
import AnalisisData from "../components/processing/AnalisisData";
import PreprocessingData from "../components/processing/PreprocessingData";
import SplitData from "../components/processing/SplitData";

function ProcessingDataPage() {
  const { csvData, activeTab = "analisis", setActiveTab } = useData();
  const [direction, setDirection] = useState(1);
  const [prevTab, setPrevTab] = useState("analisis");

  // Tab order untuk menentukan direction
  const tabOrder = { analisis: 0, preprocessing: 1, split: 2 };

  const handleTabClick = (tab) => {
    // Determine direction based on tab order
    const currentIndex = tabOrder[prevTab] || 0;
    const nextIndex = tabOrder[tab] || 0;
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setPrevTab(tab);
    setActiveTab(tab);
  };

  // Update prevTab when activeTab changes externally
  useEffect(() => {
    if (activeTab && activeTab !== prevTab) {
      const currentIndex = tabOrder[prevTab] || 0;
      const nextIndex = tabOrder[activeTab] || 0;
      setDirection(nextIndex > currentIndex ? 1 : -1);
      setPrevTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="modern-page-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Floating Decorative Shapes */}
      <div className="floating-blob floating-blob-cyan w-96 h-96 top-20 -left-48"></div>
      <div className="floating-blob floating-blob-blue w-80 h-80 top-1/3 -right-40"></div>
      <div className="floating-blob floating-blob-purple w-72 h-72 bottom-20 left-1/4"></div>
      <div className="floating-blob floating-blob-indigo w-64 h-64 bottom-1/4 right-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiRefreshCw className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Processing Data
              </h1>
              <p className="text-sm text-gray-600">
                Analisis dan pemrosesan data untuk prediksi customer churn
              </p>
            </div>
          </div>
        </div>

        {/* Data Asli Section */}
        <div
          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8 mb-6 animate-scaleIn"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FiBarChart2 className="text-blue-600 text-2xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Asli</h2>
              <p className="text-sm text-gray-600">
                {csvData
                  ? `${csvData.total_rows} baris data | ${csvData.columns.length} kolom`
                  : "Belum ada data"}
              </p>
            </div>
          </div>

          {csvData ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      #
                    </th>
                    {csvData.columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.preview.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-blue-50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${rowIndex * 0.05}s` }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rowIndex + 1}
                      </td>
                      {csvData.columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                        >
                          {row[column] !== null && row[column] !== undefined
                            ? String(row[column])
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Belum ada data. Silakan upload data di halaman Input Data.
              </p>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-blue-300"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>

        {/* Action Buttons */}
        <div
          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 mb-6 animate-scaleIn"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(59, 130, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex gap-4">
            <motion.button
              onClick={() => handleTabClick("analisis")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
                activeTab === "analisis"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {activeTab === "analisis" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Analisis Data</span>
            </motion.button>
            <motion.button
              onClick={() => handleTabClick("preprocessing")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
                activeTab === "preprocessing"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {activeTab === "preprocessing" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Preprocessing</span>
            </motion.button>
            <motion.button
              onClick={() => handleTabClick("split")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
                activeTab === "split"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {activeTab === "split" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Split Data</span>
            </motion.button>
          </div>
        </div>

        {/* Content berdasarkan tab aktif dengan animasi */}
        <div
          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8 overflow-hidden relative"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(59, 130, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
            minHeight: "400px",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "analisis" && (
              <motion.div
                key="analisis"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 100 : -100,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -100 : 100,
                  scale: 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  duration: 0.3,
                }}
              >
                <React.Suspense
                  fallback={<div className="text-center py-8">Loading...</div>}
                >
                  <AnalisisData />
                </React.Suspense>
              </motion.div>
            )}
            {activeTab === "preprocessing" && (
              <motion.div
                key="preprocessing"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 100 : -100,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -100 : 100,
                  scale: 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  duration: 0.3,
                }}
              >
                <React.Suspense
                  fallback={<div className="text-center py-8">Loading...</div>}
                >
                  <PreprocessingData />
                </React.Suspense>
              </motion.div>
            )}
            {activeTab === "split" && (
              <motion.div
                key="split"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 100 : -100,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -100 : 100,
                  scale: 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  duration: 0.3,
                }}
              >
                <React.Suspense
                  fallback={<div className="text-center py-8">Loading...</div>}
                >
                  <SplitData />
                </React.Suspense>
              </motion.div>
            )}
            {!activeTab && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <p className="text-gray-500">Pilih tab untuk memulai</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ProcessingDataPage;
