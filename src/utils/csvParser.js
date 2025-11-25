/**
 * Parse CSV file directly in the browser without backend
 * @param {File} file - CSV file object
 * @returns {Promise<Object>} Parsed CSV data with summary
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        console.log('File content length:', text.length);
        
        // Split lines, keep empty lines for now
        const lines = text.split(/\r?\n/);
        console.log('Total lines:', lines.length);

        if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === "")) {
          reject(new Error("File CSV kosong"));
          return;
        }

        // Parse header (baris pertama)
        const headers = parseCsvLine(lines[0]).map(h => h.trim());
        const columnCount = headers.length;
        console.log('Headers:', headers, 'Column count:', columnCount);

        if (headers.length === 0) {
          reject(new Error("File CSV tidak memiliki header"));
          return;
        }

        // Parse data rows
        const dataRows = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line === "") continue; // Skip empty lines
          
          const values = parseCsvLine(line);
          // Handle rows with different column counts
          if (values.length > 0) {
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] !== undefined ? values[index].trim() : null;
            });
            dataRows.push(row);
          }
        }

        console.log('Parsed rows:', dataRows.length);

        if (dataRows.length === 0) {
          reject(new Error("File CSV tidak memiliki data (hanya header)"));
          return;
        }

        // Create summary
        const summary = {
          filename: file.name,
          total_rows: dataRows.length,
          columns: headers,
          preview: dataRows.slice(0, 10), // First 10 rows for preview
        };

        console.log('Summary created:', summary);
        resolve({
          message: "File processed successfully",
          data: summary,
        });
      } catch (error) {
        console.error('CSV parsing error:', error);
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file, "UTF-8");
  });
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - CSV line string
 * @returns {Array<string>} Array of parsed values
 */
function parseCsvLine(line) {
  if (!line || line.trim() === "") {
    return [];
  }

  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Alternative simple CSV parser (fallback)
 * Splits by comma, handles basic cases
 */
function parseCsvLineSimple(line) {
  if (!line || line.trim() === "") {
    return [];
  }
  
  // Simple split by comma, remove quotes
  return line.split(',').map(cell => {
    return cell.trim().replace(/^["']|["']$/g, '');
  });
}

/**
 * Alternative: Use PapaParse library for more robust CSV parsing
 * Install: npm install papaparse
 * 
 * import Papa from 'papaparse';
 * 
 * export function parseCsvFileWithPapaParse(file) {
 *   return new Promise((resolve, reject) => {
 *     Papa.parse(file, {
 *       header: true,
 *       skipEmptyLines: true,
 *       complete: (results) => {
 *         const data = results.data;
 *         const summary = {
 *           filename: file.name,
 *           total_rows: data.length,
 *           columns: results.meta.fields || [],
 *           preview: data.slice(0, 10),
 *         };
 *         resolve({ message: "File processed successfully", data: summary });
 *       },
 *       error: (error) => {
 *         reject(new Error(`Error parsing CSV: ${error.message}`));
 *       },
 *     });
 *   });
 * }
 */

