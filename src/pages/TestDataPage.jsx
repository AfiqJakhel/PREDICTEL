import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiBarChart2,
} from "react-icons/fi";
import { useData } from "../hooks/useData";
import { trainModel, predict } from "../services/api";

function TestDataPage() {
  const { csvData } = useData();
  const [activeTab, setActiveTab] = useState("training");
  const [modelTrained, setModelTrained] = useState(false);
  const [trainingResult, setTrainingResult] = useState(null);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState(null);

  // Prediction form state
  const [predictionInput, setPredictionInput] = useState({
    tenure: 12,
    contract: "Month-to-month",
    monthly_charges: 70.0,
    total_charges: 840.0,
    gender: "Male",
    senior: "No",
    partner: "No",
    dependents: "No",
    internet: "DSL",
    payment: "Electronic check",
    paperless: "Yes",
    tech_support: "No",
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  // Check if data is available
  const hasData = csvData && csvData.filename;

  const handleTrainModel = async () => {
    if (!hasData) return;

    setTraining(true);
    setError(null);
    setTrainingResult(null);

    try {
      const result = await trainModel(csvData.filename);
      setTrainingResult(result);
      setModelTrained(true);
    } catch (err) {
      setError(err.message);
      setModelTrained(false);
    } finally {
      setTraining(false);
    }
  };

  const handlePredict = async () => {
    if (!hasData || !modelTrained) return;

    setPredicting(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      // Map input ke format yang sesuai dengan model
      // Karena kita tidak tahu kolom pasti dari dataset, kita akan mengirim semua nilai
      // Backend akan handle mapping-nya
      const inputData = {
        Tenure: predictionInput.tenure,
        MonthlyCharges: predictionInput.monthly_charges,
        TotalCharges: predictionInput.total_charges,
        Gender: predictionInput.gender === "Male" ? 1 : 0,
        SeniorCitizen: predictionInput.senior === "Yes" ? 1 : 0,
        Partner: predictionInput.partner === "Yes" ? 1 : 0,
        Dependents: predictionInput.dependents === "Yes" ? 1 : 0,
        Contract:
          predictionInput.contract === "Month-to-month"
            ? 0
            : predictionInput.contract === "One year"
            ? 1
            : 2,
        InternetService:
          predictionInput.internet === "Fiber optic"
            ? 1
            : predictionInput.internet === "DSL"
            ? 0
            : 2,
        PaymentMethod:
          predictionInput.payment === "Electronic check" ? 2 : 0,
        PaperlessBilling: predictionInput.paperless === "Yes" ? 1 : 0,
        TechSupport: predictionInput.tech_support === "Yes" ? 1 : 0,
      };

      const result = await predict(csvData.filename, inputData);
      setPredictionResult(result);
    } catch (err) {
      setPredictionError(err.message);
    } finally {
      setPredicting(false);
    }
  };

  // Update total charges when tenure or monthly charges change
  useEffect(() => {
    setPredictionInput((prev) => ({
      ...prev,
      total_charges: prev.tenure * prev.monthly_charges,
    }));
  }, [predictionInput.tenure, predictionInput.monthly_charges]);

  return (
    <div className="modern-page-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Floating Decorative Shapes */}
      <div className="floating-blob floating-blob-cyan w-96 h-96 top-20 -left-48"></div>
      <div className="floating-blob floating-blob-blue w-80 h-80 top-1/3 -right-40"></div>
      <div className="floating-blob floating-blob-purple w-72 h-72 bottom-20 left-1/4"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiActivity className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Test Data & Prediction
              </h1>
              <p className="text-sm text-gray-600">
                Latih model dan lakukan prediksi customer churn
              </p>
            </div>
          </div>
        </div>

        {/* Warning jika data belum tersedia */}
        {!hasData && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-amber-600 text-2xl" />
              <div>
                <p className="font-semibold text-amber-900">
                  Data Training belum tersedia
                </p>
                <p className="text-sm text-amber-700">
                  Silakan lakukan <strong>Preprocessing</strong> dan{" "}
                  <strong>Split Data</strong> terlebih dahulu.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-6 mb-6">
          <div className="flex gap-4">
            <motion.button
              onClick={() => setActiveTab("training")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
                activeTab === "training"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {activeTab === "training" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <FiTrendingUp />
                Latih & Evaluasi Model
              </span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("prediction")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
                activeTab === "prediction"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {activeTab === "prediction" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <FiActivity />
                Simulasi Prediksi (Test)
              </span>
            </motion.button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Training Section */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Training Model Logistic Regression
                </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Model akan dilatih menggunakan data yang telah di-split sebelumnya.</strong>
                    </p>
                    <p className="text-xs text-blue-700">
                      Pastikan Anda sudah melakukan <strong>Split Data</strong> di halaman Processing Data dan memilih <strong>Target Column</strong> (kolom yang ingin diprediksi).
                    </p>
                  </div>
                  <button
                    onClick={handleTrainModel}
                    disabled={!hasData || training}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {training ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Melatih Model...
                      </>
                    ) : (
                      <>
                        <FiTrendingUp />
                        Latih Model Sekarang
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-900 mb-2">Error Training Model</p>
                        <p className="text-sm text-red-700 whitespace-pre-wrap mb-3">{error}</p>
                        {error.includes("terlalu banyak nilai unik") || error.includes("continuous") ? (
                          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mt-3">
                            <p className="text-xs text-amber-800 font-semibold mb-1">💡 Solusi untuk Error Ini:</p>
                            <ul className="text-xs text-amber-800 list-disc list-inside space-y-1">
                              <li>Target column harus bersifat <strong>kategorikal</strong>, bukan numerik kontinyu</li>
                              <li>Pilih kolom seperti: "Churn", "Status", atau kolom Yes/No</li>
                              <li><strong>JANGAN</strong> pilih kolom numerik seperti TotalCharges, MonthlyCharges, dll</li>
                              <li>Untuk binary classification, pilih kolom dengan 2 nilai (0/1 atau Yes/No)</li>
                              <li>Kembali ke halaman Split Data dan pilih target column yang berbeda</li>
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mt-3">
                            <p className="text-xs text-blue-800">
                              <strong>Tips:</strong> Pastikan Anda sudah melakukan Split Data di halaman Processing Data dengan memilih Target Column yang bersifat kategorikal.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Training Results */}
                {trainingResult && (
                  <div className="mt-8 space-y-6">
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Hasil Evaluasi
                      </h3>

                      {/* Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                          <p className="text-sm text-gray-600 mb-2">
                            Akurasi Model
                          </p>
                          <p className="text-3xl font-bold text-cyan-600">
                            {(trainingResult.accuracy * 100).toFixed(2)}%
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            High Accuracy
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <p className="text-sm text-gray-600 mb-2">
                            ROC AUC Score
                          </p>
                          <p className="text-3xl font-bold text-blue-600">
                            {trainingResult.roc_auc
                              ? trainingResult.roc_auc.toFixed(2)
                              : "N/A"}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-2">Algoritma</p>
                          <p className="text-xl font-bold text-indigo-600">
                            {trainingResult.algorithm}
                          </p>
                        </div>
                      </div>

                      {/* Confusion Matrix */}
                      {trainingResult.confusion_matrix && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Confusion Matrix
                          </h4>
                          <div className="space-y-6">
                            {/* Visualisasi Confusion Matrix */}
                            {trainingResult.confusion_matrix_image ? (
                              <div className="bg-white border-2 border-cyan-400 rounded-xl p-6">
                                <img
                                  src={trainingResult.confusion_matrix_image}
                                  alt="Confusion Matrix"
                                  className="w-full h-auto rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="bg-white border-2 border-cyan-400 rounded-xl p-6">
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="text-xs text-gray-500 pb-2">
                                        Actual \ Predicted
                                      </th>
                                      <th className="text-xs text-gray-500 pb-2">
                                        0
                                      </th>
                                      <th className="text-xs text-gray-500 pb-2">
                                        1
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {trainingResult.confusion_matrix.map(
                                      (row, i) => (
                                        <tr key={i}>
                                          <td className="text-xs font-semibold text-gray-700 py-2">
                                            {i}
                                          </td>
                                          {row.map((cell, j) => (
                                            <td
                                              key={j}
                                              className="text-center text-lg font-bold text-cyan-600 py-2"
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            
                            {/* Penjelasan */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                Cara Membaca:
                              </h5>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>
                                  • <strong>Kiri Atas:</strong> True Negative
                                  (Prediksi Aman, Ternyata Aman)
                                </li>
                                <li>
                                  • <strong>Kanan Bawah:</strong> True Positive
                                  (Prediksi Churn, Ternyata Churn)
                                </li>
                                <li>
                                  • <strong>Kanan Atas/Kiri Bawah:</strong>{" "}
                                  Kesalahan Prediksi
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "prediction" && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {!modelTrained ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <FiAlertCircle className="text-amber-600 text-2xl" />
                    <p className="text-amber-900">
                      Silakan latih model di tab "Latih & Evaluasi Model"
                      terlebih dahulu.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Simulasi Prediksi Pelanggan
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Masukkan data pelanggan di bawah ini untuk memprediksi
                      risiko churn.
                    </p>

                    {/* Input Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Kolom 1: Informasi Akun */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-4">
                          Informasi Akun
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lama Langganan (Bulan)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="72"
                            value={predictionInput.tenure}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                tenure: parseInt(e.target.value),
                              })
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span className="font-semibold">
                              {predictionInput.tenure}
                            </span>
                            <span>72</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kontrak
                          </label>
                          <select
                            value={predictionInput.contract}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                contract: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>Month-to-month</option>
                            <option>One year</option>
                            <option>Two year</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tagihan Bulanan ($)
                          </label>
                          <input
                            type="number"
                            min="18"
                            max="120"
                            step="0.1"
                            value={predictionInput.monthly_charges}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                monthly_charges: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Tagihan ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="9000"
                            step="0.1"
                            value={predictionInput.total_charges}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                total_charges: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      {/* Kolom 2: Demografi */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-4">
                          Demografi
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            value={predictionInput.gender}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                gender: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>Male</option>
                            <option>Female</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senior Citizen
                          </label>
                          <select
                            value={predictionInput.senior}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                senior: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Partner
                          </label>
                          <select
                            value={predictionInput.partner}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                partner: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dependents
                          </label>
                          <select
                            value={predictionInput.dependents}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                dependents: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>
                      </div>

                      {/* Kolom 3: Layanan */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-4">
                          Layanan Utama
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Internet Service
                          </label>
                          <select
                            value={predictionInput.internet}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                internet: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>DSL</option>
                            <option>Fiber optic</option>
                            <option>No</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Metode Bayar
                          </label>
                          <select
                            value={predictionInput.payment}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                payment: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>Electronic check</option>
                            <option>Mailed check</option>
                            <option>Bank transfer</option>
                            <option>Credit card</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paperless Billing
                          </label>
                          <select
                            value={predictionInput.paperless}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                paperless: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tech Support
                          </label>
                          <select
                            value={predictionInput.tech_support}
                            onChange={(e) =>
                              setPredictionInput({
                                ...predictionInput,
                                tech_support: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500"
                          >
                            <option>No</option>
                            <option>Yes</option>
                            <option>No internet service</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handlePredict}
                      disabled={predicting}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {predicting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Memproses Prediksi...
                        </>
                      ) : (
                        <>
                          <FiActivity />
                          Prediksi Hasil
                        </>
                      )}
                    </button>

                    {predictionError && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <FiAlertCircle className="text-red-500 text-xl" />
                          <p className="text-sm text-red-700">
                            {predictionError}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prediction Results */}
                  {predictionResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border-2 border-cyan-400 p-6">
                        <h3 className="text-2xl font-bold text-cyan-900 mb-2 uppercase">
                          Prediction Result
                        </h3>
                      </div>

                      {/* Result Card */}
                      <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border-2 border-cyan-400 p-8">
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            Prediction Result:{" "}
                            <span
                              className={
                                predictionResult.prediction === 1 ||
                                (predictionResult.probabilities &&
                                  predictionResult.probabilities.length > 0 &&
                                  predictionResult.probabilities[
                                    predictionResult.probabilities.length - 1
                                  ] > 0.5)
                                  ? "text-red-500 text-3xl"
                                  : "text-green-500 text-3xl"
                              }
                            >
                              {predictionResult.prediction === 1 ||
                              (predictionResult.probabilities &&
                                predictionResult.probabilities.length > 0 &&
                                predictionResult.probabilities[
                                  predictionResult.probabilities.length - 1
                                ] > 0.5)
                                ? "POTENSI CHURN"
                                : "LOYAL / AMAN"}
                            </span>
                          </h4>
                          <p className="text-gray-600">
                            {predictionResult.prediction === 1 ||
                            (predictionResult.probabilities &&
                              predictionResult.probabilities.length > 0 &&
                              predictionResult.probabilities[
                                predictionResult.probabilities.length - 1
                              ] > 0.5)
                              ? "Pelanggan ini memiliki risiko tinggi untuk berhenti berlangganan."
                              : "Pelanggan ini diprediksi akan tetap setia berlangganan."}
                          </p>
                        </div>

                        {/* Graph Card */}
                        <div className="bg-white border-2 border-cyan-400 rounded-xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center">
                              <div className="text-6xl text-cyan-500 mb-4">
                                📈
                              </div>
                              <div className="font-bold text-gray-700">
                                Result Graph
                              </div>
                            </div>
                            <div>
                              {predictionResult.probabilities &&
                                predictionResult.probabilities.length > 0 && (
                                  <div className="space-y-4">
                                    {predictionResult.probabilities.map(
                                      (prob, idx) => (
                                        <div key={idx}>
                                          <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">
                                              {
                                                predictionResult.classes
                                                  ? predictionResult.classes[idx]
                                                  : idx
                                              }
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                              {(prob * 100).toFixed(1)}%
                                            </span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                              className={`h-4 rounded-full ${
                                                idx ===
                                                predictionResult.probabilities.length -
                                                  1
                                                  ? "bg-red-500"
                                                  : "bg-green-500"
                                              }`}
                                              style={{
                                                width: `${prob * 100}%`,
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Reset Button */}
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => {
                              setPredictionResult(null);
                              setPredictionInput({
                                tenure: 12,
                                contract: "Month-to-month",
                                monthly_charges: 70.0,
                                total_charges: 840.0,
                                gender: "Male",
                                senior: "No",
                                partner: "No",
                                dependents: "No",
                                internet: "DSL",
                                payment: "Electronic check",
                                paperless: "Yes",
                                tech_support: "No",
                              });
                            }}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                          >
                            Kembali / Reset
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TestDataPage;

