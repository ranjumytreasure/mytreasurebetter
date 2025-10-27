// Export utilities for reports and data

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 */
export const exportToCSV = (data, filename = 'export.csv') => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        // Headers
        headers.join(','),
        // Data rows
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes in values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export data to JSON format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 */
export const exportToJSON = (data, filename = 'export.json') => {
    if (!data) {
        console.warn('No data to export');
        return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export data to Excel format (simplified)
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
    // For now, export as CSV with .xlsx extension
    // In a real implementation, you would use a library like xlsx
    exportToCSV(data, filename.replace('.xlsx', '.csv'));
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: INR)
 */
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount || 0);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale (default: en-IN)
 */
export const formatDate = (date, locale = 'en-IN') => {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format date and time for display
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale (default: en-IN)
 */
export const formatDateTime = (date, locale = 'en-IN') => {
    return new Date(date).toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Generate report filename with timestamp
 * @param {string} reportType - Type of report
 * @param {string} format - File format (csv, json, xlsx)
 */
export const generateReportFilename = (reportType, format = 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${reportType}-${timestamp}.${format}`;
};

/**
 * Print data to PDF (simplified - in real implementation use jsPDF)
 * @param {Array} data - Data to print
 * @param {string} title - Title of the document
 */
export const printToPDF = (data, title = 'Report') => {
    // For now, just open print dialog
    // In a real implementation, you would use jsPDF or similar
    const printWindow = window.open('', '_blank');
    const htmlContent = `
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>
                            ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row =>
        `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`
    ).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
};







