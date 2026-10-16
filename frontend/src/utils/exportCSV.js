/**
 * exportCSV.js
 * Generates and downloads a CSV file directly in the browser without any backend.
 */

/**
 * Converts an array of objects into a CSV string and triggers a browser download.
 * @param {Array<Object>} data - Array of row objects
 * @param {string} filename - Desired filename (e.g. 'IoTCloud_Devices.csv')
 * @param {Array<{key: string, label: string}>} columns - Optional explicit column definitions
 */
export function exportToCSV(data, filename = 'export.csv', columns = null) {
  if (!Array.isArray(data) || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Determine headers
  let headers = [];
  if (columns && Array.isArray(columns) && columns.length > 0) {
    headers = columns;
  } else {
    // Derive from first item keys
    headers = Object.keys(data[0]).map((key) => ({
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
    }));
  }

  // Build CSV Header row
  const headerRow = headers.map((col) => `"${escapeCSV(col.label)}"`).join(',');

  // Build Data rows
  const dataRows = data.map((item) => {
    return headers
      .map((col) => {
        const val = item[col.key];
        if (val === undefined || val === null) return '""';
        if (typeof val === 'object') {
          return `"${escapeCSV(JSON.stringify(val))}"`;
        }
        return `"${escapeCSV(String(val))}"`;
      })
      .join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(str) {
  return String(str).replace(/"/g, '""');
}
