import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FiScissors,
  FiCheckCircle,
  FiAlertCircle,
  FiHash,
  FiTag,
} from "react-icons/fi";
import { splitData, identifyFeatures } from "../../services/api";
import { useData } from "../../hooks/useData";
import CustomSelect from "../ui/CustomSelect";

function SplitData() {
  const {
    csvData,
    analysisResult,
    splitResult: contextSplitResult,
    setSplitResult: setContextSplitResult,
  } = useData();
  const [splitResult, setSplitResult] = useState(contextSplitResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [numericalColumns, setNumericalColumns] = useState([]);
  const [categoricalColumns, setCategoricalColumns] = useState([]);
  const [options, setOptions] = useState({
    test_size: 0.2,
    random_state: 42,
    target_column: "",
  });

  // Load kolom numerikal dan kategorikal saat component mount atau data berubah
  useEffect(() => {
    if (csvData?.filename) {
      loadColumnTypes();
    }
  }, [csvData?.filename]);

  // Load split result from context when component mounts
  useEffect(() => {
    if (contextSplitResult) {
      setSplitResult(contextSplitResult);
    }
  }, [contextSplitResult]);

  const loadColumnTypes = async () => {
    if (!csvData?.filename) return;

    setLoadingFeatures(true);
    try {
      // Coba ambil dari analysis result terlebih dahulu
      if (analysisResult) {
        const numericCols = analysisResult.numeric_summary
          ? Object.keys(analysisResult.numeric_summary)
          : [];
        const categoricalCols = analysisResult.categorical_summary
          ? Object.keys(analysisResult.categorical_summary)
          : [];

        // Jika ada kolom yang belum terdeteksi, gunakan identifyFeatures
        if (numericCols.length === 0 && categoricalCols.length === 0) {
          const result = await identifyFeatures(csvData.filename, 6);
          setNumericalColumns(result.numerical_features || []);
          setCategoricalColumns(result.categorical_features || []);
        } else {
          setNumericalColumns(numericCols);
          setCategoricalColumns(categoricalCols);
        }
      } else {
        // Jika tidak ada analysis result, gunakan identifyFeatures
        const result = await identifyFeatures(csvData.filename, 6);
        setNumericalColumns(result.numerical_features || []);
        setCategoricalColumns(result.categorical_features || []);
      }
    } catch (err) {
      console.error("Error loading column types:", err);
    } finally {
      setLoadingFeatures(false);
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

  const handleSplit = async () => {
    if (!csvData?.filename) return;

    setLoading(true);
    setError(null);

    try {
      const result = await splitData(csvData.filename, {
        test_size: options.test_size,
        random_state: options.random_state,
        target_column: options.target_column || undefined,
      });
      setSplitResult(result);
      // Save to context to persist across navigation
      setContextSplitResult(result);
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
        className="flex items-center gap-4 mb-6"
        variants={itemVariants}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <FiScissors className="text-white text-2xl" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Split Data</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bagi data menjadi train set dan test set
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-cyan-500 text-xl" />
            <p className="text-sm text-cyan-700">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Tabel Kolom Numerikal dan Kategorikal */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
      >
        {/* Kolom Numerikal */}
        <motion.div
          className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <FiHash className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Kolom Numerikal
              </h3>
              <p className="text-xs text-gray-600">
                {numericalColumns.length} kolom
              </p>
            </div>
          </div>
          {loadingFeatures ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-600 mt-2">Memuat kolom...</p>
            </div>
          ) : numericalColumns.length > 0 ? (
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase">
                      Nama Kolom
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {numericalColumns.map((col, idx) => (
                    <tr key={col} className="hover:bg-cyan-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 font-medium">
                        {col}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Tidak ada kolom numerikal terdeteksi
            </div>
          )}
        </motion.div>

        {/* Kolom Kategorikal */}
        <motion.div
          className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(59, 130, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FiTag className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Kolom Kategorikal
              </h3>
              <p className="text-xs text-gray-600">
                {categoricalColumns.length} kolom
              </p>
            </div>
          </div>
          {loadingFeatures ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-600 mt-2">Memuat kolom...</p>
            </div>
          ) : categoricalColumns.length > 0 ? (
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase">
                      Nama Kolom
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoricalColumns.map((col, idx) => (
                    <tr key={col} className="hover:bg-blue-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 font-medium">
                        {col}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Tidak ada kolom kategorikal terdeteksi
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Split Options */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 space-y-4 hover:shadow-3xl transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiScissors className="text-white text-lg" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Konfigurasi Split Data
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Size (0.0 - 1.0)
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={options.test_size}
            onChange={(e) =>
              setOptions({ ...options, test_size: parseFloat(e.target.value) })
            }
            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all"
          />
          <p className="mt-1 text-xs text-gray-500">
            Proporsi data untuk test set (default: 0.2 = 20%)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Random State
          </label>
          <input
            type="number"
            value={options.random_state}
            onChange={(e) =>
              setOptions({
                ...options,
                random_state: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all"
          />
          <p className="mt-1 text-xs text-gray-500">
            Seed untuk reproducibility (default: 42)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target Column{" "}
            <span className="text-red-500">*WAJIB untuk Training Model</span>
          </label>
          <CustomSelect
            value={options.target_column}
            onChange={(value) =>
              setOptions({ ...options, target_column: value })
            }
            options={[
              { value: "", label: "Pilih kolom target..." },
              ...categoricalColumns.map((col) => ({ value: col, label: col })),
            ]}
            placeholder="Pilih kolom target..."
          />
          {categoricalColumns.length === 0 && (
            <div className="mt-2 bg-amber-50 border border-amber-300 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>⚠️ Belum ada kolom kategorikal terdeteksi.</strong>{" "}
                Silakan lakukan Analisis Data terlebih dahulu untuk
                mengidentifikasi kolom kategorikal.
              </p>
            </div>
          )}
          <div className="mt-2">
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>⚠️ Penting:</strong> Target column harus{" "}
                <strong>kategorikal</strong> (contoh: Yes/No, 0/1).{" "}
                <strong>WAJIB dipilih</strong> untuk training model.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSplit}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses Split...
            </>
          ) : (
            <>
              <FiScissors className="text-xl" />
              Split Data
            </>
          )}
        </button>
      </motion.div>

      {/* Split Result */}
      {splitResult && (
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Split Ratio Info */}
          <motion.div
            className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Hasil Split Data
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Train Set</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {(splitResult.split_ratio?.train * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Test Set</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(splitResult.split_ratio?.test * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Train Data */}
          {splitResult.train && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              style={{
                boxShadow:
                  "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Train Set</h3>
                  <p className="text-sm text-gray-600">
                    {splitResult.train.X_shape
                      ? `${splitResult.train.X_shape.rows} baris x ${splitResult.train.X_shape.columns} kolom`
                      : `${splitResult.train.shape?.rows} baris x ${splitResult.train.shape?.columns} kolom`}
                  </p>
                </div>
              </div>

              {splitResult.train.X_preview && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                          #
                        </th>
                        {Object.keys(splitResult.train.X_preview[0] || {}).map(
                          (col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-left text-xs font-bold text-white uppercase"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {splitResult.train.X_preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cyan-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {idx + 1}
                          </td>
                          {Object.entries(row).map(([col, val]) => (
                            <td
                              key={col}
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {val !== null && val !== undefined
                                ? String(val)
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {splitResult.train.preview && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                          #
                        </th>
                        {Object.keys(splitResult.train.preview[0] || {}).map(
                          (col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-left text-xs font-bold text-white uppercase"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {splitResult.train.preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cyan-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {idx + 1}
                          </td>
                          {Object.entries(row).map(([col, val]) => (
                            <td
                              key={col}
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {val !== null && val !== undefined
                                ? String(val)
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Test Data */}
          {splitResult.test && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              style={{
                boxShadow:
                  "0 8px 32px 0 rgba(59, 130, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Test Set</h3>
                  <p className="text-sm text-gray-600">
                    {splitResult.test.X_shape
                      ? `${splitResult.test.X_shape.rows} baris x ${splitResult.test.X_shape.columns} kolom`
                      : `${splitResult.test.shape?.rows} baris x ${splitResult.test.shape?.columns} kolom`}
                  </p>
                </div>
              </div>

              {splitResult.test.X_preview && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                          #
                        </th>
                        {Object.keys(splitResult.test.X_preview[0] || {}).map(
                          (col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-left text-xs font-bold text-white uppercase"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {splitResult.test.X_preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {idx + 1}
                          </td>
                          {Object.entries(row).map(([col, val]) => (
                            <td
                              key={col}
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {val !== null && val !== undefined
                                ? String(val)
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {splitResult.test.preview && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                          #
                        </th>
                        {Object.keys(splitResult.test.preview[0] || {}).map(
                          (col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-left text-xs font-bold text-white uppercase"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {splitResult.test.preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {idx + 1}
                          </td>
                          {Object.entries(row).map(([col, val]) => (
                            <td
                              key={col}
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {val !== null && val !== undefined
                                ? String(val)
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Button Split Ulang - Di bawah hasil split */}
          <motion.div className="flex gap-4 mt-6" variants={itemVariants}>
            <button
              onClick={handleSplit}
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses Split...
                </>
              ) : (
                <>
                  <FiScissors className="text-2xl" />
                  Split Data Ulang
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SplitData;
