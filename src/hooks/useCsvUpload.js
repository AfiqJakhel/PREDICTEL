import { useState } from "react";
import { uploadCsv } from "../services/api";
import { parseCsvFile } from "../utils/csvParser";

// Toggle ini untuk switch antara frontend-only atau backend
const USE_FRONTEND_ONLY = false; // Set false untuk menggunakan backend Python (pandas)

export function useCsvUpload() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processFile = async (selected) => {
    if (!selected) return;

    // Validasi file type
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setError("File harus berformat CSV");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      let data;

      if (USE_FRONTEND_ONLY) {
        // Parse CSV langsung di frontend (tanpa backend)
        console.log("Parsing CSV file:", selected.name);
        const response = await parseCsvFile(selected);
        console.log("CSV parsed successfully:", response);
        // Pastikan struktur data sama dengan backend response
        data = response.data || response;
      } else {
        // Menggunakan backend (Flask)
        console.log("Uploading to backend:", selected.name);
        data = await uploadCsv(selected);
        console.log("Backend response:", data);
      }

      // Pastikan result memiliki struktur { data: {...} } untuk konsistensi
      console.log("Setting result:", { data });
      setResult({ data });

      setTimeout(() => {
        const el = document.getElementById("result");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (e) {
      console.error("Error processing file:", e);
      const errorMessage = e.message || "Terjadi kesalahan saat memproses file";
      setError(errorMessage);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      processFile(f);
    }
  };

  const handleDrop = (e) => {
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      setFile(f);
      processFile(f);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return {
    file,
    isProcessing,
    result,
    error,
    handleFileChange,
    handleDrop,
    handleRemoveFile,
  };
}
