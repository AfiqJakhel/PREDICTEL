import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiBarChart2, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { useData } from "../hooks/useData";
import { visualizeData, analyzeData } from "../services/api";

function VisualisasiDataPage() {
  const { csvData, analysisResult } = useData();
  const [activeTab, setActiveTab] = useState("numerik");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState(null);
  
  // State untuk tab Numerik
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("Scatter Plot");
  const [useHue, setUseHue] = useState(true);
  
  // State untuk tab Kategorikal
  const [selectedCats, setSelectedCats] = useState([]);
  
  // State untuk tab Numerikal
  const [selectedNumerics, setSelectedNumerics] = useState([]);
  
  // State untuk tab Numerik vs Kategorikal
  const [selectedCategorical, setSelectedCategorical] = useState("");
  const [selectedNumericVsCat, setSelectedNumericVsCat] = useState([]);
  
  const [numericColumns, setNumericColumns] = useState([]);
  const [categoricalColumns, setCategoricalColumns] = useState([]);
  const [targetColumn, setTargetColumn] = useState("");

  useEffect(() => {
    if (csvData?.filename && analysisResult) {
      // Extract numeric and categorical columns from analysis result
      const numericCols = analysisResult.numeric_summary 
        ? Object.keys(analysisResult.numeric_summary)
        : [];
      const categoricalCols = analysisResult.categorical_summary
        ? Object.keys(analysisResult.categorical_summary)
        : [];
      
      setNumericColumns(numericCols);
      setCategoricalColumns(categoricalCols);
      
      // Auto-detect target column (usually Churn or similar)
      const possibleTargets = ['Churn', 'churn', 'HeartDisease', 'heart_disease', 'target', 'Target'];
      const foundTarget = possibleTargets.find(t => 
        numericCols.includes(t) || categoricalCols.includes(t) || csvData.columns.includes(t)
      );
      if (foundTarget) {
        setTargetColumn(foundTarget);
      } else if (categoricalCols.length > 0) {
        setTargetColumn(categoricalCols[0]);
      }
      
      // Set default values
      if (numericCols.length > 0) {
        setXAxis(numericCols[0]);
        if (numericCols.length > 1) {
          setYAxis(numericCols[1]);
        }
      }
      if (categoricalCols.length > 0) {
        setSelectedCats([categoricalCols[0]]);
        setSelectedCategorical(categoricalCols[0]);
      }
      if (numericCols.length > 0) {
        setSelectedNumerics([numericCols[0]]);
        setSelectedNumericVsCat(numericCols.slice(0, 3));
      }
    }
  }, [csvData, analysisResult]);

  const handleGenerateGraph = async (type) => {
    if (!csvData?.filename) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let plotType = "scatter";
      let columns = [];
      let hueColumn = null;
      
      if (type === "numerik") {
        if (!xAxis || !yAxis) {
          throw new Error("Pilih kolom untuk sumbu X dan Y");
        }
        columns = [xAxis, yAxis];
        if (chartType === "Scatter Plot") plotType = "scatter";
        else if (chartType === "Bar Chart") plotType = "bar";
        else if (chartType === "Line Chart") plotType = "line";
        if (useHue && targetColumn) {
          hueColumn = targetColumn;
        }
      } else if (type === "kategorikal") {
        if (selectedCats.length === 0) {
          throw new Error("Pilih minimal satu kolom kategorikal");
        }
        columns = selectedCats;
        plotType = "countplot";
      } else if (type === "numerikal") {
        if (selectedNumerics.length === 0) {
          throw new Error("Pilih minimal satu kolom numerikal");
        }
        columns = selectedNumerics;
        plotType = "histogram";
      } else if (type === "numerik_vs_kategorikal") {
        if (!selectedCategorical || selectedNumericVsCat.length === 0) {
          throw new Error("Pilih kolom kategorikal dan numerikal");
        }
        columns = [selectedCategorical, ...selectedNumericVsCat];
        plotType = "boxplot_multi";
        if (targetColumn) {
          hueColumn = targetColumn;
        }
      }
      
      const response = await fetch("/api/visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: csvData.filename,
          plot_type: plotType,
          columns: columns,
          hue_column: hueColumn,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data?.error || "Failed to generate visualization");
      }
      
      setGraphData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!csvData) {
    return (
      <div className="modern-page-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8 text-center">
            <FiAlertCircle className="text-amber-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Data Belum Tersedia
            </h2>
            <p className="text-gray-600">
              Silakan upload data di halaman Input Data terlebih dahulu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabVariants = {
    active: {
      scale: 1.05,
      backgroundColor: "rgba(6, 182, 212, 0.1)",
    },
    inactive: {
      scale: 1,
      backgroundColor: "transparent",
    },
  };

  return (
    <div className="modern-page-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Floating Decorative Shapes */}
      <div className="floating-blob floating-blob-cyan w-96 h-96 top-20 -left-48"></div>
      <div className="floating-blob floating-blob-blue w-80 h-80 top-1/3 -right-40"></div>
      <div className="floating-blob floating-blob-purple w-72 h-72 bottom-20 left-1/4"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiBarChart2 className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 uppercase">
                Data Visualization
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Visualisasi dan analisis data untuk insight yang lebih baik
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { id: "numerik", label: "Visualisasi Numerik" },
              { id: "kategorikal", label: "Visualisasi Kategorikal" },
              { id: "numerikal", label: "Visualisasi Numerikal" },
              { id: "numerik_vs_kategorikal", label: "Numerik vs Kategorikal" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variants={tabVariants}
                animate={activeTab === tab.id ? "active" : "inactive"}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-amber-500 text-xl" />
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8">
          {/* Tab 1: Visualisasi Numerik */}
          {activeTab === "numerik" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
                Visualisasi Numerik
              </h2>
              
              <div className="space-y-6">
                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Kolom untuk Sumbu X
                    </label>
                    <select
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all"
                    >
                      <option value="">Pilih kolom...</option>
                      {numericColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Kolom untuk Sumbu Y
                    </label>
                    <select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all"
                    >
                      <option value="">Pilih kolom...</option>
                      {numericColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Jenis Grafik
                    </label>
                    <div className="space-y-2">
                      {["Scatter Plot", "Bar Chart", "Line Chart"].map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="chartType"
                            value={type}
                            checked={chartType === type}
                            onChange={(e) => setChartType(e.target.value)}
                            className="w-4 h-4 text-cyan-600"
                          />
                          <span className="text-sm font-medium text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {targetColumn && (
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useHue}
                          onChange={(e) => setUseHue(e.target.checked)}
                          className="w-4 h-4 text-cyan-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Tampilkan berdasarkan {targetColumn}
                        </span>
                      </label>
                    </div>
                  )}

                  <button
                    onClick={() => handleGenerateGraph("numerik")}
                    disabled={loading || !xAxis || !yAxis}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Tampilkan Grafik
                      </>
                    )}
                  </button>
                </div>

                {/* Graph Display - Di bawah controls */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Result Graph</h3>
                  {graphData?.image ? (
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                      <img
                        src={graphData.image}
                        alt="Visualization"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                      <FiBarChart2 className="text-gray-400 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">
                        Silakan pilih kolom dan tekan tombol <strong>"Tampilkan Grafik"</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Visualisasi Kategorikal */}
          {activeTab === "kategorikal" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
                Visualisasi Kategorikal
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Fitur Kategorikal untuk Visualisasi
                    </label>
                    <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
                      {categoricalColumns.map((col) => (
                        <label
                          key={col}
                          className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCats.includes(col)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCats([...selectedCats, col]);
                              } else {
                                setSelectedCats(selectedCats.filter((c) => c !== col));
                              }
                            }}
                            className="w-4 h-4 text-cyan-600"
                          />
                          <span className="text-sm font-medium text-gray-700">{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateGraph("kategorikal")}
                    disabled={loading || selectedCats.length === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Tampilkan Grafik
                      </>
                    )}
                  </button>
                </div>

                {/* Graph Display - Di bawah controls */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Result Graph</h3>
                  {graphData?.image ? (
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                      <img
                        src={graphData.image}
                        alt="Visualization"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                      <FiBarChart2 className="text-gray-400 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">
                        Silakan pilih fitur kategorikal dan tekan tombol <strong>"Tampilkan Grafik"</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Visualisasi Numerikal */}
          {activeTab === "numerikal" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
                Visualisasi Numerikal
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Fitur Numerik untuk Visualisasi
                    </label>
                    <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
                      {numericColumns.map((col) => (
                        <label
                          key={col}
                          className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedNumerics.includes(col)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNumerics([...selectedNumerics, col]);
                              } else {
                                setSelectedNumerics(selectedNumerics.filter((c) => c !== col));
                              }
                            }}
                            className="w-4 h-4 text-cyan-600"
                          />
                          <span className="text-sm font-medium text-gray-700">{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateGraph("numerikal")}
                    disabled={loading || selectedNumerics.length === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Tampilkan Grafik Numerik
                      </>
                    )}
                  </button>
                </div>

                {/* Graph Display - Di bawah controls */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Result Graph</h3>
                  {graphData?.image ? (
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                      <img
                        src={graphData.image}
                        alt="Visualization"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                      <FiBarChart2 className="text-gray-400 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">
                        Silakan pilih fitur numerik dan tekan tombol <strong>"Tampilkan Grafik Numerik"</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Numerik vs Kategorikal */}
          {activeTab === "numerik_vs_kategorikal" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
                Visualisasi Fitur Numerik vs Kategorikal
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Fitur Kategorikal
                    </label>
                    <select
                      value={selectedCategorical}
                      onChange={(e) => setSelectedCategorical(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all"
                    >
                      <option value="">Pilih kolom kategorikal...</option>
                      {categoricalColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Fitur Numerik (maksimal 3)
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
                      {numericColumns.map((col) => (
                        <label
                          key={col}
                          className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedNumericVsCat.includes(col)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedNumericVsCat.length < 3) {
                                  setSelectedNumericVsCat([...selectedNumericVsCat, col]);
                                }
                              } else {
                                setSelectedNumericVsCat(selectedNumericVsCat.filter((c) => c !== col));
                              }
                            }}
                            disabled={!selectedNumericVsCat.includes(col) && selectedNumericVsCat.length >= 3}
                            className="w-4 h-4 text-cyan-600"
                          />
                          <span className="text-sm font-medium text-gray-700">{col}</span>
                        </label>
                      ))}
                    </div>
                    {selectedNumericVsCat.length >= 3 && (
                      <p className="text-xs text-amber-600 mt-2">
                        Maksimal 3 fitur numerik yang dipilih
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleGenerateGraph("numerik_vs_kategorikal")}
                    disabled={loading || !selectedCategorical || selectedNumericVsCat.length === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Tampilkan Grafik
                      </>
                    )}
                  </button>
                </div>

                {/* Graph Display - Di bawah controls */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Result Graph</h3>
                  {graphData?.image ? (
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                      <img
                        src={graphData.image}
                        alt="Visualization"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                      <FiBarChart2 className="text-gray-400 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">
                        Silakan pilih fitur untuk visualisasi dan tekan tombol <strong>"Tampilkan Grafik"</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualisasiDataPage;

