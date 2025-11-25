import React, { useState } from "react";
import { DataContext } from "./DataContextInstance";

export function DataProvider({ children }) {
  const [csvData, setCsvData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [activeTab, setActiveTab] = useState("analisis"); // 'analisis', 'preprocessing', 'split'
  // Store result for InputDataPage persistence
  const [uploadResult, setUploadResult] = useState(null);
  // Store file metadata for display purposes
  const [fileMetadata, setFileMetadata] = useState(null);
  // Store analysis result
  const [analysisResult, setAnalysisResult] = useState(null);
  // Store split result to persist across navigation
  const [splitResult, setSplitResult] = useState(null);

  return (
    <DataContext.Provider
      value={{
        csvData,
        setCsvData,
        processedData,
        setProcessedData,
        activeTab,
        setActiveTab,
        uploadResult,
        setUploadResult,
        fileMetadata,
        setFileMetadata,
        analysisResult,
        setAnalysisResult,
        splitResult,
        setSplitResult,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
