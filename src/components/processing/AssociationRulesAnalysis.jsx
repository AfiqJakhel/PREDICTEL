import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiLink, FiAlertCircle, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { performAssociationRules } from "../../services/api";
import { useData } from "../../hooks/useData";

function AssociationRulesAnalysis() {
  const { csvData, analysisResult } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [associationResult, setAssociationResult] = useState(null);
  
  const [minSupport, setMinSupport] = useState(0.1);
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [categoricalColumns, setCategoricalColumns] = useState([]);

  useEffect(() => {
    if (analysisResult) {
      const categoricalCols = analysisResult.categorical_summary
        ? Object.keys(analysisResult.categorical_summary)
        : [];
      setCategoricalColumns(categoricalCols);
      if (categoricalCols.length > 0 && selectedColumns.length === 0) {
        setSelectedColumns(categoricalCols.slice(0, 3));
      }
    }
  }, [analysisResult]);

  const handlePerformAnalysis = async () => {
    if (!csvData?.filename) return;
    
    if (selectedColumns.length < 2) {
      setError("Pilih minimal 2 kolom kategorikal untuk association rules");
      return;
    }

    if (minSupport <= 0 || minSupport >= 1) {
      setError("Min Support harus antara 0 dan 1");
      return;
    }

    if (minConfidence <= 0 || minConfidence >= 1) {
      setError("Min Confidence harus antara 0 dan 1");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await performAssociationRules(csvData.filename, {
        min_support: minSupport,
        min_confidence: minConfidence,
        columns: selectedColumns,
      });
      setAssociationResult(result);
    } catch (err) {
      setError(err.message || "Gagal melakukan analisis association rules");
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

  if (!csvData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Belum ada data. Silakan upload data di halaman Input Data.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <FiLink className="text-white text-2xl" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Association Rules</h2>
          <p className="text-sm text-gray-600 mt-1">
            Analisis pola hubungan antar item menggunakan Apriori algorithm
          </p>
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

      {/* Configuration */}
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 space-y-4"
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Konfigurasi Association Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Support (0.0 - 1.0)
            </label>
            <input
              type="number"
              min="0.01"
              max="0.99"
              step="0.01"
              value={minSupport}
              onChange={(e) => setMinSupport(parseFloat(e.target.value) || 0.1)}
              className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">
              Frekuensi minimum itemset muncul (default: 0.1 = 10%)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Confidence (0.0 - 1.0)
            </label>
            <input
              type="number"
              min="0.01"
              max="0.99"
              step="0.01"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value) || 0.5)}
              className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">
              Probabilitas konskuensi muncul jika anteseden muncul (default: 0.5 = 50%)
            </p>
          </div>
        </div>

        {/* Column Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kolom Kategorikal (Minimal 2)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
            {categoricalColumns.length === 0 ? (
              <p className="text-sm text-gray-500">
                Tidak ada kolom kategorikal tersedia. Silakan lakukan analisis data terlebih dahulu.
              </p>
            ) : (
              categoricalColumns.map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedColumns.length < 5) {
                          setSelectedColumns([...selectedColumns, col]);
                        }
                      } else {
                        setSelectedColumns(selectedColumns.filter((c) => c !== col));
                      }
                    }}
                    disabled={!selectedColumns.includes(col) && selectedColumns.length >= 5}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{col}</span>
                </label>
              ))
            )}
          </div>
          {selectedColumns.length >= 5 && (
            <p className="mt-2 text-xs text-amber-600">
              Maksimal 5 kolom yang dapat dipilih
            </p>
          )}
        </div>

        <button
          onClick={handlePerformAnalysis}
          disabled={loading || selectedColumns.length < 2}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiRefreshCw className="animate-spin" />
              Memproses Analisis...
            </>
          ) : (
            <>
              <FiLink />
              Jalankan Analisis Association Rules
            </>
          )}
        </button>
      </motion.div>

      {/* Results */}
      {associationResult && (
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Total Itemsets</p>
              <p className="text-xl font-bold text-orange-600">
                {associationResult.total_itemsets || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-gray-600 mb-1">Frequent Itemsets</p>
              <p className="text-xl font-bold text-red-600">
                {associationResult.frequent_itemsets_count || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
              <p className="text-sm text-gray-600 mb-1">Rules Ditemukan</p>
              <p className="text-xl font-bold text-pink-600">
                {associationResult.rules_count || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-200">
              <p className="text-sm text-gray-600 mb-1">Min Support</p>
              <p className="text-xl font-bold text-rose-600">
                {(associationResult.min_support * 100).toFixed(1)}%
              </p>
            </div>
          </motion.div>

          {/* Top Frequent Itemsets */}
          {associationResult.top_frequent_itemsets && associationResult.top_frequent_itemsets.length > 0 && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top Frequent Itemsets
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-orange-500 to-red-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Itemset
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Support
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {associationResult.top_frequent_itemsets.map((itemset, idx) => (
                      <tr key={idx} className="hover:bg-orange-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {itemset.itemset.join(", ")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {(itemset.support * 100).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {itemset.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Top Rules */}
          {associationResult.top_rules && associationResult.top_rules.length > 0 && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top Association Rules
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-red-500 to-pink-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Antecedent (Jika)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Consequent (Maka)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Support
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Confidence
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Lift
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {associationResult.top_rules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-red-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          {rule.antecedent}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          {rule.consequent}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {(rule.support * 100).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-semibold">
                          {(rule.confidence * 100).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {rule.lift.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {associationResult.rules_count === 0 && (
            <motion.div
              className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-amber-500 text-xl" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Tidak ada rules yang ditemukan
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Coba turunkan nilai Min Support atau Min Confidence untuk menemukan lebih banyak rules.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default AssociationRulesAnalysis;

