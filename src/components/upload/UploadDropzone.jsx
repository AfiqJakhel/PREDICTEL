import React, { useState } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

function UploadDropzone({ onFileChange, onDrop, file, onRemoveFile }) {
  const [isDragging, setIsDragging] = useState(false);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    preventDefaults(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    preventDefaults(e);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    preventDefaults(e);
    setIsDragging(false);
    if (onDrop) {
      onDrop(e);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className={`upload-dropzone ${
        isDragging ? "upload-dropzone-dragging" : "upload-dropzone-default"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={preventDefaults}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!file ? (
        <div className="space-y-3 text-center">
          {/* Upload Icon with Animation */}
          <div
            className={`mx-auto transition-transform duration-300 ${
              isDragging ? "scale-110" : ""
            }`}
          >
            <div className="upload-icon-container">
              <FiUploadCloud className="text-white text-4xl animate-bounce-slow" />
            </div>
          </div>

          {/* Upload Title */}
          <h3 className="text-2xl font-semibold text-gray-800 pt-2">
            Upload file
          </h3>

          {/* Upload Text */}
          <div className="space-y-4">
            <p className="text-gray-600 text-base">
              Drag or drop your files here or click to upload
            </p>

            {/* Upload Button */}
            <div className="pt-3">
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg cursor-pointer transition-colors shadow-md hover:shadow-lg"
              >
                <FiUploadCloud className="text-xl" />
                <span>Choose File</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv"
                  onChange={onFileChange}
                />
              </label>
            </div>

            {/* File Type Info */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-3">
              <FiFile className="text-cyan-500" />
              <span>File CSV maksimal 100MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-6">
          {/* Upload Title */}
          <h3 className="text-2xl font-semibold text-gray-800 text-center pt-2">
            Upload file
          </h3>

          <p className="text-gray-600 text-center text-base">
            Drag or drop your files here or click to upload
          </p>

          {/* Uploaded File Info */}
          <div className="w-full bg-gray-100 rounded-lg p-6 flex items-center justify-between hover:bg-gray-200 gap-14 transition-colors mt-4 min-h-[90px]">
            <div className="flex items-start gap-4 flex-1">
              <FiFile className="text-cyan-600 text-3xl mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0 py-1">
                <p className="text-gray-900 font-semibold truncate text-lg mb-2">
                  {file.name}
                </p>
                <div className="flex items-center gap-12 mt-1">
                  <span className="text-gray-600 text-sm">
                    {file.type || "text/csv"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right py-1">
                <span className="text-gray-700 font-semibold whitespace-nowrap text-lg block mb-1">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-gray-600 text-sm whitespace-nowrap">
                  modified {formatDate(file.lastModified)}
                </span>
              </div>
              {onRemoveFile && (
                <button
                  onClick={onRemoveFile}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                  title="Remove file"
                >
                  <FiX className="text-2xl" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadDropzone;
