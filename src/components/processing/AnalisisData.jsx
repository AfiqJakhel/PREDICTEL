import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiBarChart2,
  FiAlertCircle,
  FiCheckCircle,
  FiTarget,
  FiLink,
} from "react-icons/fi";
import { analyzeData } from "../../services/api";
import { useData } from "../../hooks/useData";
import ClusteringAnalysis from "./ClusteringAnalysis";
import AssociationRulesAnalysis from "./AssociationRulesAnalysis";

function AnalisisData() {
  const { csvData, analysisResult, setAnalysisResult } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("deskriptif");

  useEffect(() => {
    if (csvData && csvData.filename) {
      // Jika belum ada analysis result di context, load analysis
      if (!analysisResult || !analysisResult.shape) {
        loadAnalysis();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvData?.filename]);

  // Ensure analysis result is preserved when switching back to deskriptif tab
  useEffect(() => {
    // When switching back to deskriptif tab, check if we need to reload
    if (activeTab === "deskriptif" && csvData?.filename) {
      // Only reload if analysisResult is completely missing
      if (
        !analysisResult ||
        (!analysisResult.shape &&
          !analysisResult.numeric_summary &&
          !analysisResult.categorical_summary)
      ) {
        if (!loading) {
          loadAnalysis();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadAnalysis = async () => {
    if (!csvData?.filename) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeData(csvData.filename);
      setAnalysisResult(result); // Simpan ke context (analysis akan otomatis update dari context)
    } catch (err) {
      console.error("Error loading analysis:", err);
      setError(
        err.message || "Gagal memuat analisis data. Pastikan backend berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!csvData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Belum ada data. Silakan upload data di halaman Input Data.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <FiBarChart2 className="text-blue-600 text-2xl" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analisis Data</h2>
            <p className="text-sm text-gray-600">
              Statistik deskriptif, clustering, dan association rules
            </p>
          </div>
        </div>
        {activeTab === "deskriptif" && (
          <button
            onClick={loadAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Memproses..." : "Refresh Analisis"}
          </button>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-2"
        variants={itemVariants}
      >
        <div className="flex gap-2">
          {[
            {
              id: "deskriptif",
              label: "Statistik Deskriptif",
              icon: FiBarChart2,
            },
            { id: "clustering", label: "Clustering", icon: FiTarget },
            { id: "association", label: "Association Rules", icon: FiLink },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="p-4 bg-red-50 border border-red-200 rounded-xl"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-red-500 text-xl" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {loading && activeTab === "deskriptif" && (
        <motion.div className="text-center py-8" variants={itemVariants}>
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">
            Memproses analisis data...
          </p>
        </motion.div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Semua tab dalam satu AnimatePresence untuk animasi yang konsisten */}
        <AnimatePresence mode="wait">
          {activeTab === "deskriptif" && (
            <motion.div
              key="deskriptif"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                staggerChildren: 0.1,
                delayChildren: 0.1,
              }}
            >
              {analysisResult &&
              (analysisResult.shape ||
                analysisResult.numeric_summary ||
                analysisResult.categorical_summary ||
                analysisResult.missing_values ||
                analysisResult.dtypes) ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Shape Info */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <p className="text-sm text-gray-600 mb-1">Total Baris</p>
                      <p className="text-2xl font-bold text-cyan-600">
                        {analysisResult.shape?.rows || 0}
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <p className="text-sm text-gray-600 mb-1">Total Kolom</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {analysisResult.shape?.columns || 0}
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <p className="text-sm text-gray-600 mb-1">
                        Missing Values
                      </p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {Object.values(
                          analysisResult.missing_values || {}
                        ).reduce((a, b) => a + (b || 0), 0)}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Missing Values & Data Types - Grid Layout */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Missing Values */}
                    {analysisResult.missing_values &&
                      Object.keys(analysisResult.missing_values).length > 0 && (
                        <motion.div
                          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/50 p-4"
                          variants={itemVariants}
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <h3 className="text-base font-bold text-gray-900 mb-3">
                            Missing Values per Kolom
                          </h3>
                          <div className="overflow-x-auto max-h-64">
                            <table className="min-w-full divide-y divide-gray-200 text-xs">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                                    Kolom
                                  </th>
                                  <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                                    Missing
                                  </th>
                                  <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                                    %
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(
                                  analysisResult.missing_values
                                ).map(([col, count]) => (
                                  <tr key={col} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5 text-xs font-medium text-gray-900">
                                      {col}
                                    </td>
                                    <td className="px-2 py-1.5 text-xs text-gray-700">
                                      {count}
                                    </td>
                                    <td className="px-2 py-1.5 text-xs text-gray-700">
                                      {analysisResult.missing_percentage?.[
                                        col
                                      ]?.toFixed(2) || 0}
                                      %
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}

                    {/* Data Types */}
                    {analysisResult.dtypes && (
                      <motion.div
                        className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/50 p-4"
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <h3 className="text-base font-bold text-gray-900 mb-3">
                          Tipe Data per Kolom
                        </h3>
                        <div className="overflow-x-auto max-h-64">
                          <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                                  Kolom
                                </th>
                                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                                  Tipe Data
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.entries(analysisResult.dtypes).map(
                                ([col, dtype]) => (
                                  <tr key={col} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5 text-xs font-medium text-gray-900">
                                      {col}
                                    </td>
                                    <td className="px-2 py-1.5 text-xs text-gray-700">
                                      {dtype}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Numeric Summary & Categorical Summary - Grid Layout */}
                  <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Numeric Summary */}
                    {analysisResult.numeric_summary &&
                      Object.keys(analysisResult.numeric_summary).length >
                        0 && (
                        <motion.div
                          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/50 p-4"
                          variants={itemVariants}
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <h3 className="text-base font-bold text-gray-900 mb-3">
                            Statistik Deskriptif (Numeric)
                          </h3>
                          <div className="overflow-x-auto max-h-96">
                            <table className="min-w-full divide-y divide-gray-200 text-xs">
                              <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 sticky top-0">
                                <tr>
                                  <th className="px-2 py-1.5 text-left text-xs font-bold text-white uppercase">
                                    Statistik
                                  </th>
                                  {Object.keys(
                                    analysisResult.numeric_summary
                                  ).map((col) => (
                                    <th
                                      key={col}
                                      className="px-2 py-1.5 text-left text-xs font-bold text-white uppercase"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                  "count",
                                  "mean",
                                  "std",
                                  "min",
                                  "25%",
                                  "50%",
                                  "75%",
                                  "max",
                                ].map((stat) => (
                                  <tr key={stat} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5 text-xs font-medium text-gray-900">
                                      {stat}
                                    </td>
                                    {Object.keys(
                                      analysisResult.numeric_summary
                                    ).map((col) => (
                                      <td
                                        key={col}
                                        className="px-2 py-1.5 text-xs text-gray-700"
                                      >
                                        {analysisResult.numeric_summary[col]?.[
                                          stat
                                        ]?.toFixed(2) || "-"}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}

                    {/* Categorical Summary */}
                    {analysisResult.categorical_summary &&
                      Object.keys(analysisResult.categorical_summary).length >
                        0 && (
                        <motion.div
                          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/50 p-4"
                          variants={itemVariants}
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <h3 className="text-base font-bold text-gray-900 mb-3">
                            Summary Kategorikal
                          </h3>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {Object.entries(
                              analysisResult.categorical_summary
                            ).map(([col, info]) => (
                              <div
                                key={col}
                                className="border border-gray-200 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-indigo-50"
                              >
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                                  {col}
                                </h4>
                                <p className="text-xs text-gray-600 mb-2">
                                  Unique: {info.unique_count}
                                </p>
                                {info.top_values && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-700 mb-1">
                                      Top Values:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {Object.entries(info.top_values).map(
                                        ([val, count]) => (
                                          <span
                                            key={val}
                                            className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                                          >
                                            {val}: {count}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
                >
                  <p className="text-gray-500 mb-4">
                    {loading
                      ? "Memproses analisis data..."
                      : 'Silakan klik tombol "Refresh Analisis" untuk memuat statistik deskriptif'}
                  </p>
                  {!loading && (
                    <button
                      onClick={loadAnalysis}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
                    >
                      Muat Analisis
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "clustering" && (
            <motion.div
              key="clustering"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <ClusteringAnalysis />
            </motion.div>
          )}

          {activeTab === "association" && (
            <motion.div
              key="association"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <AssociationRulesAnalysis />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AnalisisData;
