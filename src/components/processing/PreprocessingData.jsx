import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiTrash2,
  FiCheckCircle,
  FiTrendingUp,
  FiDatabase,
  FiLayers,
  FiFilter,
  FiTarget,
  FiZap,
  FiScissors,
} from "react-icons/fi";
import {
  preprocessData,
  detectOutliers,
  dropColumns,
  identifyFeatures,
} from "../../services/api";
import { useData } from "../../hooks/useData";
import CustomSelect from "../ui/CustomSelect";

function PreprocessingData() {
  const { csvData, setCsvData, analysisResult, setActiveTab, processedData: contextProcessedData, setProcessedData: setContextProcessedData } = useData();
  const [processedData, setProcessedData] = useState(contextProcessedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({
    handle_missing: "",
    label_encode: false,
  });
  const [selectedColumn, setSelectedColumn] = useState("");
  const [outliers, setOutliers] = useState(null);
  const [columnsToDrop, setColumnsToDrop] = useState([]);
  const [numericalFeatures, setNumericalFeatures] = useState([]);
  const [categoricalFeatures, setCategoricalFeatures] = useState([]);

  if (!csvData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Belum ada data. Silakan upload data di halaman Input Data.
        </p>
      </div>
    );
  }

  // Get numeric columns from analysis result (numeric_summary keys)
  // Priority: 1. Analysis result numeric columns, 2. Identified features, 3. Empty array (no fallback to all columns)
  const numericColumnsFromAnalysis = analysisResult?.numeric_summary 
    ? Object.keys(analysisResult.numeric_summary)
    : [];
  
  const numericColumns = numericColumnsFromAnalysis.length > 0
    ? numericColumnsFromAnalysis
    : numericalFeatures.length > 0 
      ? numericalFeatures 
      : [];

  // Reset selected column if it's not in the numeric columns list
  useEffect(() => {
    if (selectedColumn && numericColumns.length > 0 && !numericColumns.includes(selectedColumn)) {
      setSelectedColumn("");
    }
  }, [numericColumns, selectedColumn]);

  // Load processed data from context when component mounts
  useEffect(() => {
    if (contextProcessedData) {
      setProcessedData(contextProcessedData);
    }
  }, [contextProcessedData]);

  const handleDetectOutliers = async () => {
    if (!selectedColumn || !csvData?.filename) return;

    setLoading(true);
    setError(null);
    try {
      const result = await detectOutliers(csvData.filename, selectedColumn);
      setOutliers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreprocess = async () => {
    if (!csvData?.filename) return;

    setLoading(true);
    setError(null);

    try {
      const result = await preprocessData(csvData.filename, options);
      setProcessedData(result);
      // Save to context to persist across navigation
      setContextProcessedData(result);
      // Update data di context agar perubahan tersimpan
      if (result.preview && result.columns) {
        setCsvData({
          ...csvData,
          columns: result.columns,
          preview: result.preview,
          total_rows: result.processed_shape?.rows || csvData.total_rows,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifyFeatures = async () => {
    if (!csvData?.filename) return;

    setLoading(true);
    setError(null);
    try {
      const result = await identifyFeatures(csvData.filename, 6);
      setNumericalFeatures(result.numerical_features || []);
      setCategoricalFeatures(result.categorical_features || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDropColumns = async () => {
    if (!csvData?.filename || columnsToDrop.length === 0) {
      alert("Pilih kolom yang ingin dihapus terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await dropColumns(csvData.filename, columnsToDrop);
      // Update csvData dengan data baru
      setCsvData({
        ...csvData,
        columns: result.columns,
        preview: result.preview,
        total_rows: result.new_shape.rows,
      });
      setColumnsToDrop([]);
      alert(`Kolom yang dihapus: ${columnsToDrop.join(", ")}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiZap className="text-white text-2xl" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Preprocessing Data</h2>
            <p className="text-sm text-gray-600 mt-1">
              Deteksi outliers, penanganan missing values, dan encoding
            </p>
          </div>
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

      {/* Deteksi Outliers */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(139, 92, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Deteksi Outliers</h3>
            <p className="text-xs text-gray-500">Identifikasi nilai yang tidak normal</p>
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Kolom Numerik
            </label>
            {numericColumns.length === 0 ? (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>⚠️ Belum ada kolom numerik terdeteksi.</strong>
                  <br />
                  <span className="text-xs">
                    Silakan lakukan <strong>Analisis Data</strong> di tab sebelumnya untuk mengidentifikasi kolom numerik.
                  </span>
                </p>
              </div>
            ) : (
              <CustomSelect
                value={selectedColumn}
                onChange={setSelectedColumn}
                options={[
                  { value: "", label: "Pilih kolom..." },
                  ...numericColumns.map((col) => ({ value: col, label: col })),
                ]}
                placeholder="Pilih kolom..."
              />
            )}
          </div>
          <button
            onClick={handleDetectOutliers}
            disabled={!selectedColumn || loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              <>
                <FiTarget />
                Deteksi
              </>
            )}
          </button>
        </div>
        {outliers && (
          <div className="mt-6 p-5 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-cyan-900">
                  {outliers.outliers_count} Outliers Ditemukan ({outliers.percentage}%)
                </p>
                <p className="text-xs text-cyan-700">Kolom: {outliers.column}</p>
              </div>
            </div>
            {outliers.bounds && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Lower Bound</p>
                  <p className="text-sm font-bold text-cyan-700">{outliers.bounds.lower.toFixed(2)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Upper Bound</p>
                  <p className="text-sm font-bold text-cyan-700">{outliers.bounds.upper.toFixed(2)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Q1</p>
                  <p className="text-sm font-bold text-cyan-700">{outliers.bounds.Q1.toFixed(2)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Q3</p>
                  <p className="text-sm font-bold text-cyan-700">{outliers.bounds.Q3.toFixed(2)}</p>
                </div>
              </div>
            )}
            {outliers.outliers_preview && outliers.outliers_preview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  Preview Outliers:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-yellow-100">
                      <tr>
                        {Object.keys(outliers.outliers_preview[0]).map((key) => (
                          <th key={key} className="px-2 py-1 text-left">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outliers.outliers_preview.slice(0, 5).map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-2 py-1">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Penanganan Missing Values */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(59, 130, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiDatabase className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Penanganan Missing Values</h3>
            <p className="text-xs text-gray-500">Isi atau hapus nilai yang hilang</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Metode Pengisian
            </label>
            <div className="relative">
              <CustomSelect
                value={options.handle_missing}
                onChange={(value) =>
                  setOptions({ ...options, handle_missing: value })
                }
                options={[
                  { value: "", label: "Pilih metode..." },
                  { value: "mean", label: "Mean (Rata-rata)" },
                  { value: "median", label: "Median (Nilai Tengah)" },
                  { value: "mode", label: "Mode (Nilai Paling Sering)" },
                  { value: "drop", label: "Hapus Baris" },
                ]}
                placeholder="Pilih metode..."
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Penghapusan Kolom */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiTrash2 className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Penghapusan Kolom</h3>
            <p className="text-xs text-gray-500">Hapus kolom yang tidak diperlukan</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Pilih Kolom yang Ingin Dihapus
            </label>
            <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-2 border-cyan-200 rounded-xl p-4 max-h-72 overflow-y-auto custom-scrollbar shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {csvData.columns.map((col) => {
                  const isSelected = columnsToDrop.includes(col);
                  return (
                    <label
                      key={col}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all group ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-lg transform scale-[1.02]'
                          : 'bg-white border-gray-200 hover:border-cyan-300 hover:shadow-md hover:bg-cyan-50'
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setColumnsToDrop([...columnsToDrop, col]);
                            } else {
                              setColumnsToDrop(columnsToDrop.filter((c) => c !== col));
                            }
                          }}
                          className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white border-white'
                              : 'border-gray-300 text-cyan-600 focus:ring-cyan-500 focus:ring-2'
                          }`}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FiCheckCircle className="text-cyan-500 text-sm" />
                          </div>
                        )}
                      </div>
                      <span className={`flex-1 text-sm font-semibold ${
                        isSelected ? 'text-white' : 'text-gray-700 group-hover:text-cyan-700'
                      }`}>
                        {col}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <FiTrash2 className="text-white text-xs" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
            {columnsToDrop.length > 0 && (
              <div className="mt-4 p-3 bg-cyan-100 border border-cyan-200 rounded-lg">
                <p className="text-xs font-semibold text-cyan-900 mb-2">
                  {columnsToDrop.length} kolom dipilih:
                </p>
                <div className="flex flex-wrap gap-2">
                  {columnsToDrop.map((col) => (
                    <span
                      key={col}
                      className="px-3 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1"
                    >
                      {col}
                      <button
                        onClick={() => {
                          setColumnsToDrop(columnsToDrop.filter((c) => c !== col));
                        }}
                        className="ml-1 hover:bg-cyan-600 rounded-full p-0.5 transition-colors"
                      >
                        <span className="text-white text-xs">×</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleDropColumns}
            disabled={columnsToDrop.length === 0 || loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FiTrash2 />
            Hapus {columnsToDrop.length > 0 ? `${columnsToDrop.length} ` : ""}Kolom yang Dipilih
          </button>
        </div>
      </motion.div>

      {/* Split Numeric dan Categorical */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(139, 92, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiLayers className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Identifikasi Fitur</h3>
            <p className="text-xs text-gray-500">Pisahkan fitur numerik dan kategorik</p>
          </div>
        </div>
        <button
          onClick={handleIdentifyFeatures}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses...
            </>
          ) : (
            <>
              <FiFilter />
              Identifikasi Fitur
            </>
          )}
        </button>

        {numericalFeatures.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">#</span>
              </div>
              <h4 className="font-bold text-gray-900">Fitur Numerikal ({numericalFeatures.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {numericalFeatures.map((feat) => (
                <span
                  key={feat}
                  className="px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {categoricalFeatures.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <h4 className="font-bold text-gray-900">Fitur Kategorikal ({categoricalFeatures.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoricalFeatures.map((feat) => (
                <span
                  key={feat}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Label Encoding */}
      <motion.div
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
      >
        {/* Label Encoding */}
        <motion.div
          className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <FiLayers className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Label Encoding</h3>
              <p className="text-xs text-gray-500">Encode fitur kategorikal</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200 cursor-pointer hover:bg-cyan-100 transition-colors">
              <input
                type="checkbox"
                checked={options.label_encode}
                onChange={(e) =>
                  setOptions({ ...options, label_encode: e.target.checked })
                }
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Aktifkan Label Encoding <span className="text-red-500">*WAJIB</span>
              </span>
            </label>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>⚠️ Penting:</strong> Label Encoding <strong>WAJIB</strong> diaktifkan untuk mengubah data kategorikal (seperti "Yes"/"No") menjadi numerik. Tanpa ini, training model akan gagal.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Process Button */}
      <motion.div className="flex gap-4" variants={itemVariants}>
        <button
          onClick={handlePreprocess}
          disabled={loading}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses Data...
            </>
          ) : (
            <>
              <FiZap className="text-2xl" />
              Proses Data Sekarang
            </>
          )}
        </button>
      </motion.div>

      {/* Processed Data Result */}
      {processedData && (
        <motion.div
          className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border-2 border-cyan-200 p-6 animate-fadeIn"
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(6, 182, 212, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiCheckCircle className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                Data Berhasil Diproses!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Shape: <span className="font-semibold">{processedData.processed_shape?.rows}</span> baris ×{" "}
                <span className="font-semibold">{processedData.processed_shape?.columns}</span> kolom
              </p>
            </div>
          </div>

          {processedData.preview && processedData.preview.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                      #
                    </th>
                    {processedData.columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-bold text-white uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedData.preview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      {processedData.columns.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-3 text-sm text-gray-700"
                        >
                          {row[col] !== null && row[col] !== undefined
                            ? String(row[col])
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Button untuk Navigasi ke Split Data */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setActiveTab("split")}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]"
            >
              <FiScissors className="text-2xl" />
              Lanjut ke Split Data
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PreprocessingData;

