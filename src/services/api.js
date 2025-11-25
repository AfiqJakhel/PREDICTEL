export async function uploadCsv(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to upload file");
  }

  return data.data;
}

/**
 * Analisis data dengan berbagai statistik
 */
export async function analyzeData(filename) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to analyze data");
  }

  return data.data;
}

/**
 * Preprocessing data
 */
export async function preprocessData(filename, options = {}) {
  const res = await fetch("/api/preprocess", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, options }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to preprocess data");
  }

  return data.data;
}

/**
 * Split data menjadi train dan test
 */
export async function splitData(filename, options = {}) {
  const res = await fetch("/api/split", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, ...options }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to split data");
  }

  return data.data;
}

/**
 * Generate visualization dengan matplotlib/seaborn
 */
export async function visualizeData(
  filename,
  plotType = "histogram",
  columns = []
) {
  const res = await fetch("/api/visualize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, plot_type: plotType, columns }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to generate visualization");
  }

  return data.data;
}

/**
 * Generate interactive visualization dengan Plotly
 */
export async function plotlyVisualize(
  filename,
  plotType = "scatter",
  columns = []
) {
  const res = await fetch("/api/plotly", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, plot_type: plotType, columns }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to generate plotly visualization");
  }

  return data.data;
}

/**
 * Deteksi outliers menggunakan IQR method
 */
export async function detectOutliers(filename, column) {
  const res = await fetch("/api/detect-outliers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, column }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to detect outliers");
  }

  return data.data;
}

/**
 * Hapus kolom dari data
 */
export async function dropColumns(filename, columns) {
  const res = await fetch("/api/drop-columns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, columns }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to drop columns");
  }

  return data.data;
}

/**
 * Identifikasi fitur numeric dan categorical
 */
export async function identifyFeatures(filename, threshold = 6) {
  const res = await fetch("/api/identify-features", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, threshold }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok || data.error) {
    throw new Error(data?.error || "Failed to identify features");
  }

  return data.data;
}
