import React, { useEffect, useState } from "react";
import {
  FiUploadCloud,
  FiTable,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { CsvFileUpload } from "../components/ui/CsvFileUpload";
import { useCsvUpload } from "../hooks/useCsvUpload";
import { useData } from "../hooks/useData";

function InputDataPage() {
  const {
    file: localFile,
    isProcessing,
    result: localResult,
    error,
    handleFileChange,
    handleDrop,
    handleRemoveFile,
  } = useCsvUpload();
  const {
    csvData,
    setCsvData,
    uploadResult,
    setUploadResult,
    fileMetadata,
    setFileMetadata,
  } = useData();

  // Use context result if available and no local result
  const result = localResult || uploadResult || null;

  // Create a file-like object from context for display purposes
  const [displayFile, setDisplayFile] = useState(null);

  // Load from context when component mounts or when uploadResult changes
  useEffect(() => {
    if (uploadResult && uploadResult.data && !localResult && !localFile) {
      // We have result in context but no local state
      // Create a synthetic file object for display using saved metadata
      if (fileMetadata) {
        setDisplayFile({
          name:
            uploadResult.data.filename ||
            fileMetadata.name ||
            "uploaded-file.csv",
          size: fileMetadata.size || 0,
          type: fileMetadata.type || "text/csv",
          lastModified: fileMetadata.lastModified || Date.now(),
        });
      } else {
        // Fallback if metadata not available
        setDisplayFile({
          name: uploadResult.data.filename || "uploaded-file.csv",
          size: 0,
          type: "text/csv",
          lastModified: Date.now(),
        });
      }
    } else if (localFile || localResult) {
      // If we have local state, clear display file
      setDisplayFile(null);
    }
  }, [uploadResult, localResult, localFile, fileMetadata]);

  // Save data to context when result changes
  useEffect(() => {
    if (localResult && localResult.data) {
      setCsvData(localResult.data);
      setUploadResult(localResult);
    }
  }, [localResult, setCsvData, setUploadResult]);

  // Save file metadata to context when file changes
  useEffect(() => {
    if (localFile) {
      setFileMetadata({
        name: localFile.name,
        size: localFile.size,
        type: localFile.type,
        lastModified: localFile.lastModified,
      });
    }
  }, [localFile, setFileMetadata]);

  // Use local file if available, otherwise use display file from context
  const file = localFile || displayFile;

  // Custom remove handler that also clears context
  const handleRemoveFileWithContext = () => {
    handleRemoveFile();
    setDisplayFile(null);
    setUploadResult(null);
    setCsvData(null);
    setFileMetadata(null);
  };

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
              <FiUploadCloud className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Input Data</h1>
              <p className="text-sm text-gray-600">
                Upload file CSV untuk analisis prediksi customer churn
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div
          className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-6 animate-scaleIn"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(6, 182, 212, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <CsvFileUpload
            onChange={handleFileChange}
            onDrop={handleDrop}
            file={file}
            onRemoveFile={handleRemoveFileWithContext}
            accept=".csv"
          />

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-cyan-500 text-xl flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cyan-900">Error</p>
                  <p className="text-xs text-cyan-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
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
        </div>

        {/* Data Preview Table */}
        {result && result.data && (
          <div
            className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8 animate-fadeIn"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(59, 130, 246, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FiTable className="text-blue-600 text-2xl" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Preview Data
                </h2>
                <p className="text-sm text-gray-600">
                  Total {result.data.total_rows} baris data |{" "}
                  {result.data.columns.length} kolom
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Baris</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {result.data.total_rows}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                    <FiTable className="text-white text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Kolom</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.data.columns.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="text-white text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">File Name</p>
                    <p className="text-sm font-bold text-indigo-600 truncate">
                      {result.data.filename}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <FiUploadCloud className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      #
                    </th>
                    {result.data.columns.map((column, index) => (
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
                  {result.data.preview.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-blue-50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${rowIndex * 0.05}s` }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rowIndex + 1}
                      </td>
                      {result.data.columns.map((column, colIndex) => (
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

            {/* Show More Info */}
            {result.data.total_rows > result.data.preview.length && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Menampilkan {result.data.preview.length} dari{" "}
                  {result.data.total_rows} baris data
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!file && !result && (
          <div
            className="bg-white/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 p-12 text-center animate-fadeIn"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(100, 100, 100, 0.1), 0 2px 8px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
            }}
          >
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiTable className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Data
            </h3>
            <p className="text-sm text-gray-600">
              Upload file CSV untuk melihat preview data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputDataPage;
