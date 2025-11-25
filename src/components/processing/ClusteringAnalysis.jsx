import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FiTarget,
  FiAlertCircle,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import { performClustering } from "../../services/api";
import { useData } from "../../hooks/useData";
import CustomSelect from "../ui/CustomSelect";

function ClusteringAnalysis() {
  const { csvData, analysisResult } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clusteringResult, setClusteringResult] = useState(null);

  const [method, setMethod] = useState("kmeans");
  const [nClusters, setNClusters] = useState(3);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [eps, setEps] = useState(0.5);
  const [minSamples, setMinSamples] = useState(5);

  const [numericColumns, setNumericColumns] = useState([]);

  useEffect(() => {
    if (analysisResult) {
      const numericCols = analysisResult.numeric_summary
        ? Object.keys(analysisResult.numeric_summary)
        : [];
      setNumericColumns(numericCols);
      if (numericCols.length > 0 && selectedColumns.length === 0) {
        setSelectedColumns(numericCols.slice(0, 2));
      }
    }
  }, [analysisResult]);

  const handlePerformClustering = async () => {
    if (!csvData?.filename) return;

    if (selectedColumns.length < 2) {
      setError("Pilih minimal 2 kolom numerik untuk clustering");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options = {
        method: method,
        columns: selectedColumns,
      };

      if (method === "kmeans") {
        options.n_clusters = nClusters;
      } else if (method === "dbscan") {
        options.eps = eps;
        options.min_samples = minSamples;
      }

      const result = await performClustering(csvData.filename, options);
      setClusteringResult(result);
    } catch (err) {
      setError(err.message || "Gagal melakukan clustering");
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
      <motion.div
        className="flex items-center gap-4 mb-6"
        variants={itemVariants}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <FiTarget className="text-white text-2xl" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Clustering Analysis
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Pengelompokan data menggunakan K-Means atau DBSCAN
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
          Konfigurasi Clustering
        </h3>

        {/* Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metode Clustering
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="kmeans"
                checked={method === "kmeans"}
                onChange={(e) => setMethod(e.target.value)}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm font-medium text-gray-700">K-Means</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="dbscan"
                checked={method === "dbscan"}
                onChange={(e) => setMethod(e.target.value)}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm font-medium text-gray-700">DBSCAN</span>
            </label>
          </div>
        </div>

        {/* K-Means Parameters */}
        {method === "kmeans" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Cluster (n_clusters)
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={nClusters}
              onChange={(e) => setNClusters(parseInt(e.target.value) || 3)}
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">
              Jumlah cluster yang diinginkan (2-10)
            </p>
          </div>
        )}

        {/* DBSCAN Parameters */}
        {method === "dbscan" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Epsilon (eps)
              </label>
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={eps}
                onChange={(e) => setEps(parseFloat(e.target.value) || 0.5)}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Jarak maksimum antar titik dalam cluster
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Samples
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={minSamples}
                onChange={(e) => setMinSamples(parseInt(e.target.value) || 5)}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum sampel untuk membentuk cluster
              </p>
            </div>
          </div>
        )}

        {/* Column Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kolom Numerik (Minimal 2)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
            {numericColumns.length === 0 ? (
              <p className="text-sm text-gray-500">
                Tidak ada kolom numerik tersedia. Silakan lakukan analisis data
                terlebih dahulu.
              </p>
            ) : (
              numericColumns.map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer"
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
                        setSelectedColumns(
                          selectedColumns.filter((c) => c !== col)
                        );
                      }
                    }}
                    disabled={
                      !selectedColumns.includes(col) &&
                      selectedColumns.length >= 5
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {col}
                  </span>
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
          onClick={handlePerformClustering}
          disabled={loading || selectedColumns.length < 2}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiRefreshCw className="animate-spin" />
              Memproses Clustering...
            </>
          ) : (
            <>
              <FiTarget />
              Jalankan Clustering
            </>
          )}
        </button>
      </motion.div>

      {/* Results */}
      {clusteringResult && (
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Metode</p>
              <p className="text-xl font-bold text-purple-600">
                {clusteringResult.method}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
              <p className="text-sm text-gray-600 mb-1">
                {clusteringResult.method === "K-Means"
                  ? "Jumlah Cluster"
                  : "Cluster Ditemukan"}
              </p>
              <p className="text-xl font-bold text-pink-600">
                {clusteringResult.method === "K-Means"
                  ? clusteringResult.n_clusters
                  : clusteringResult.n_clusters_found}
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-4 border border-rose-200">
              <p className="text-sm text-gray-600 mb-1">Silhouette Score</p>
              <p className="text-xl font-bold text-rose-600">
                {clusteringResult.silhouette_score
                  ? clusteringResult.silhouette_score.toFixed(3)
                  : "N/A"}
              </p>
            </div>
          </motion.div>

          {/* Visualization */}
          {clusteringResult.visualization && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Visualisasi Clustering
              </h3>
              <img
                src={clusteringResult.visualization}
                alt="Clustering Visualization"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </motion.div>
          )}

          {/* Cluster Distribution */}
          {clusteringResult.cluster_counts && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Distribusi Cluster
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(clusteringResult.cluster_counts).map(
                  ([cluster, count]) => (
                    <div
                      key={cluster}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
                    >
                      <p className="text-sm text-gray-600">
                        Cluster {cluster === "-1" ? "Noise" : cluster}
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {count}
                      </p>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Preview Data with Clusters */}
          {clusteringResult.preview && (
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Preview Data dengan Cluster
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-500 to-pink-600">
                    <tr>
                      {Object.keys(clusteringResult.preview[0] || {}).map(
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
                    {clusteringResult.preview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-purple-50">
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
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ClusteringAnalysis;
