// Daily Collection Export utilities for reports and data

/**
 * Export daily collection data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 */
export const exportDailyCollectionToCSV = (data, filename = 'daily-collection-export.csv') => {
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
 * Export daily collection data to Excel format (CSV with .xlsx extension)
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 */
export const exportDailyCollectionToExcel = (data, filename = 'daily-collection-export.xlsx') => {
    // For now, export as CSV with .xlsx extension
    // In a real implementation, you would use a library like xlsx
    exportDailyCollectionToCSV(data, filename.replace('.xlsx', '.csv'));
};

/**
 * Format currency for daily collection display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: INR)
 */
export const formatDailyCollectionCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount || 0);
};

/**
 * Format date for daily collection display
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale (default: en-IN)
 */
export const formatDailyCollectionDate = (date, locale = 'en-IN') => {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Generate daily collection report filename with timestamp
 * @param {string} reportType - Type of report
 * @param {string} format - File format (csv, xlsx, pdf)
 */
export const generateDailyCollectionReportFilename = (reportType, format = 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    return `daily-collection-${reportType}-${timestamp}.${format}`;
};

/**
 * Export loan summary data to Excel
 * @param {Object} loanData - Loan summary data
 * @param {string} filename - Filename for export
 */
export const exportLoanSummaryToExcel = (loanData, filename) => {
    const data = [
        { 'Metric': 'Total Loans', 'Value': loanData.totalLoans || 0 },
        { 'Metric': 'Active Loans', 'Value': loanData.activeLoans || 0 },
        { 'Metric': 'Completed Loans', 'Value': loanData.completedLoans || 0 },
        { 'Metric': 'Overdue Loans', 'Value': loanData.overdueLoans || 0 },
        { 'Metric': 'Total Disbursed', 'Value': formatDailyCollectionCurrency(loanData.totalDisbursed || 0) },
        { 'Metric': 'Total Collected', 'Value': formatDailyCollectionCurrency(loanData.totalCollected || 0) }
    ];

    exportDailyCollectionToExcel(data, filename);
};

/**
 * Export demand report data to Excel
 * @param {Array} receivables - Receivables data
 * @param {string} filename - Filename for export
 */
export const exportDemandReportToExcel = (receivables, filename) => {
    if (!receivables || receivables.length === 0) {
        console.warn('No receivables data to export');
        return;
    }

    const data = receivables.map(rec => ({
        'Customer': rec.customerName || '',
        'Phone': rec.customerPhone || '',
        'Product': rec.productName || '',
        'Due Amount': formatDailyCollectionCurrency(rec.dueAmount || 0),
        'Opening Balance': formatDailyCollectionCurrency(rec.openingBalance || 0),
        'Closing Balance': formatDailyCollectionCurrency(rec.closingBalance || 0)
    }));

    exportDailyCollectionToExcel(data, filename);
};

/**
 * Export outstanding report data to Excel
 * @param {Array} customers - Customer outstanding data
 * @param {string} filename - Filename for export
 */
export const exportOutstandingReportToExcel = (customers, filename) => {
    if (!customers || customers.length === 0) {
        console.warn('No customer data to export');
        return;
    }

    const data = customers.map(customer => ({
        'Customer': customer.customerName || '',
        'Phone': customer.customerPhone || '',
        'Outstanding': formatDailyCollectionCurrency(customer.totalOutstanding || 0),
        'Future Due': formatDailyCollectionCurrency(customer.totalFutureDue || 0)
    }));

    exportDailyCollectionToExcel(data, filename);
};
