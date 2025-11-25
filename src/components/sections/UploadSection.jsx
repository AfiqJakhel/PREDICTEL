import React from "react";
import UploadDropzone from "../upload/UploadDropzone";
import ResultSummary from "../result/ResultSummary";
import { FiUploadCloud } from "react-icons/fi";

function UploadSection({
  file,
  isProcessing,
  result,
  onFileChange,
  onDrop,
  onRemoveFile,
}) {
  return (
    <div
      id="upload"
      className="bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div
        className="absolute bottom-10 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="animate-fadeIn">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <FiUploadCloud className="text-white text-3xl" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl mb-4">
            <span className="block">Upload Data Pelanggan</span>
          </h2>
          <p className="mt-4 text-lg leading-7 text-gray-600 max-w-2xl mx-auto mb-12">
            Upload file CSV Anda untuk memulai analisis prediksi customer churn.
            <span className="block mt-2 text-blue-600 font-semibold">
              Cepat, aman, dan akurat.
            </span>
          </p>
        </div>

        <div className="animate-scaleIn" style={{ animationDelay: "0.2s" }}>
          <UploadDropzone
            onFileChange={onFileChange}
            onDrop={onDrop}
            file={file}
            onRemoveFile={onRemoveFile}
          />
        </div>

        {isProcessing && (
          <div className="mt-6 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <div className="w-5 h-5 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-cyan-700">
                Memproses data...
              </span>
            </div>
          </div>
        )}

        {result && <ResultSummary result={result} />}
      </div>
    </div>
  );
}

export default UploadSection;
