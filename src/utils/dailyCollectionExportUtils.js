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

    // Create and download file with UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
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
 * Format currency for Excel export (plain text, no Unicode symbols)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount as "Rs. X,XXX"
 */
export const formatCurrencyForExcel = (amount) => {
    if (!amount && amount !== 0) return 'Rs. 0';
    const num = Number(amount);
    const formatted = num.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return `Rs. ${formatted}`;
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
// Helper function to escape CSV values properly
const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

export const exportLoanSummaryToExcel = (loanData, filename) => {
    console.log('Exporting loan summary to Excel:', loanData);
    
    // Build CSV content manually to handle summary + details properly
    const csvRows = [];
    
    // Add summary section
    csvRows.push('LOAN SUMMARY REPORT');
    csvRows.push('');
    csvRows.push('Summary Metrics');
    csvRows.push('Metric,Value');
    csvRows.push(`Total Loans,${loanData.totalLoans || 0}`);
    csvRows.push(`Active Loans,${loanData.activeLoans || 0}`);
    csvRows.push(`Completed Loans,${loanData.completedLoans || 0}`);
    csvRows.push(`Overdue Loans,${loanData.overdueLoans || 0}`);
    csvRows.push(`Cancelled Loans,${loanData.cancelledLoans || 0}`);
    csvRows.push(`Total Outstanding,${escapeCSVValue(formatCurrencyForExcel(loanData.totalOutstanding || 0))}`);
    csvRows.push(`Total Disbursed,${escapeCSVValue(formatCurrencyForExcel(loanData.totalDisbursed || 0))}`);
    csvRows.push(`Total Collected,${escapeCSVValue(formatCurrencyForExcel(loanData.totalCollected || 0))}`);
    csvRows.push('');
    csvRows.push('LOAN DETAILS');
    csvRows.push('');
    
    // Add detailed loan list if available
    if (loanData.loans && Array.isArray(loanData.loans) && loanData.loans.length > 0) {
        console.log('Found loans for export:', loanData.loans.length);
        console.log('Sample loan data:', loanData.loans[0]);
        
        // Add headers for loan details
        csvRows.push('Customer,Phone,Product,Principal,Cash in Hand,Collected,Outstanding,Status,Disbursement Date');
        
        // Add loan detail rows
        loanData.loans.forEach((loan, index) => {
            // Extract with fallbacks for different field name formats
            const customerName = loan.customerName || loan.customer_name || loan.subscriber?.dc_cust_name || 'N/A';
            const customerPhone = loan.customerPhone || loan.customer_phone || loan.subscriber?.dc_cust_phone || 'N/A';
            const productName = loan.productName || loan.product_name || loan.product?.product_name || 'N/A';
            const principalAmount = parseFloat(loan.principalAmount || loan.principal_amount || 0);
            const cashInHand = parseFloat(loan.cashInHand || loan.cash_in_hand || 0);
            const collectedAmount = parseFloat(loan.collectedAmount || loan.collected_amount || 0);
            const outstanding = parseFloat(loan.closingBalance || loan.closing_balance || 0);
            const status = loan.status || 'N/A';
            const disbursementDate = loan.disbursementDate || loan.disbursement_date || 'N/A';
            
            // Format currency values
            const principalFormatted = formatCurrencyForExcel(principalAmount);
            const cashInHandFormatted = formatCurrencyForExcel(cashInHand);
            const collectedFormatted = formatCurrencyForExcel(collectedAmount);
            const outstandingFormatted = formatCurrencyForExcel(outstanding);
            
            console.log(`Loan ${index}:`, {
                customerName,
                principalAmount,
                principalFormatted,
                outstanding,
                outstandingFormatted
            });
            
            // Build row with proper CSV escaping
            const row = [
                escapeCSVValue(customerName),
                escapeCSVValue(customerPhone),
                escapeCSVValue(productName),
                escapeCSVValue(principalFormatted),
                escapeCSVValue(cashInHandFormatted),
                escapeCSVValue(collectedFormatted),
                escapeCSVValue(outstandingFormatted),
                escapeCSVValue(status),
                escapeCSVValue(disbursementDate)
            ].join(',');
            
            csvRows.push(row);
        });
    } else {
        console.warn('No loans found in loanData:', loanData);
        csvRows.push('No loan details available');
    }
    
    // Create and download file with UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const csvContent = csvRows.join('\n');
    console.log('CSV Content preview (first 500 chars):', csvContent.substring(0, 500));
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.xlsx', '.csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Excel export completed');
};

/**
 * Export demand report data to Excel
 * @param {Object|Array} reportData - Demand report data (can be receivables array or full report object)
 * @param {string} filename - Filename for export
 */
export const exportDemandReportToExcel = (reportData, filename) => {
    // Handle both array of receivables and full report object
    let receivables = Array.isArray(reportData) ? reportData : (reportData.receivables || []);
    const summaryData = Array.isArray(reportData) ? null : reportData;
    
    if (!receivables || receivables.length === 0) {
        console.warn('No receivables data to export');
        return;
    }

    const allData = [];
    
    // Add summary section if available
    if (summaryData) {
        const summary = [
            { 'Metric': 'Total Due Amount', 'Value': formatCurrencyForExcel(summaryData.totalDueAmount || 0) },
            { 'Metric': 'Total Customers', 'Value': summaryData.totalCustomers || 0 },
            { 'Metric': 'Total Receivables', 'Value': summaryData.totalReceivables || 0 }
        ];
        allData.push(...summary);
        allData.push({ 'Metric': '---', 'Value': '---' });
    }
    
    // Add detailed receivables list
    const receivablesData = receivables.map(rec => ({
        'Customer': rec.customerName || '',
        'Phone': rec.customerPhone || '',
        'Product': rec.productName || '',
        'Due Amount': formatCurrencyForExcel(rec.dueAmount || 0),
        'Opening Balance': formatCurrencyForExcel(rec.openingBalance || 0),
        'Carry Forward': formatCurrencyForExcel(rec.carryForward || 0),
        'Closing Balance': formatCurrencyForExcel(rec.closingBalance || 0)
    }));
    
    allData.push(...receivablesData);
    
    exportDailyCollectionToExcel(allData, filename);
};

/**
 * Export outstanding report data to Excel
 * @param {Object|Array} reportData - Outstanding report data (can be customers array or full report object)
 * @param {string} filename - Filename for export
 */
export const exportOutstandingReportToExcel = (reportData, filename) => {
    // Handle both array of customers and full report object
    let customers = Array.isArray(reportData) ? reportData : (reportData.customers || []);
    
    if (!customers || customers.length === 0) {
        console.warn('No customer data to export');
        alert('No customer data available to export');
        return;
    }

    console.log('Exporting outstanding report with customers:', customers.length);
    const allData = [];
    
    // Flatten customer data with loan details for Excel
    // Each loan will be a separate row with customer details (matching the table format)
    customers.forEach((customer, customerIndex) => {
        if (!customer || typeof customer !== 'object') {
            console.warn(`Skipping invalid customer at index ${customerIndex}`);
            return;
        }
        
        // Extract customer info with fallbacks for different field names
        const customerName = customer.customerName || customer.customer_name || customer.dc_cust_name || '';
        const customerPhone = customer.customerPhone || customer.customer_phone || customer.dc_cust_phone || '';
        
        console.log(`Processing customer ${customerIndex}: ${customerName}`, customer);
        
        if (customer.loans && Array.isArray(customer.loans) && customer.loans.length > 0) {
            // Add a row for each loan with detailed information
            customer.loans.forEach((loan, loanIndex) => {
                // Extract loan info with fallbacks
                const productName = loan.productName || loan.product_name || loan.product?.product_name || 'N/A';
                const principalAmount = parseFloat(loan.principalAmount || loan.principal_amount || 0);
                const outstandingAmount = parseFloat(loan.outstandingAmount || loan.outstanding_amount || loan.closing_balance || loan.closingBalance || 0);
                const futureDue = parseFloat(loan.futureDue || loan.future_due || 0);
                const remainingInstallments = loan.remainingInstallments || loan.remaining_installments || 0;
                
                // Use Principal/Outstanding format - show outstanding if available, otherwise principal
                const principalOrOutstanding = outstandingAmount > 0 ? outstandingAmount : principalAmount;
                
                const rowData = {
                    'Customer': customerName,
                    'Phone': customerPhone,
                    'Product': productName,
                    'Principal / Outstanding': formatCurrencyForExcel(principalOrOutstanding),
                    'Future Due': formatCurrencyForExcel(futureDue),
                    'Remaining': remainingInstallments
                };
                
                console.log(`Adding loan row ${loanIndex} for customer ${customerName}:`, rowData);
                allData.push(rowData);
            });
        } else {
            // If no loans, still add customer summary
            const totalOutstanding = parseFloat(customer.totalOutstanding || customer.total_outstanding || 0);
            const totalFutureDue = parseFloat(customer.totalFutureDue || customer.total_future_due || 0);
            
            const rowData = {
                'Customer': customerName,
                'Phone': customerPhone,
                'Product': 'N/A',
                'Principal / Outstanding': formatCurrencyForExcel(totalOutstanding),
                'Future Due': formatCurrencyForExcel(totalFutureDue),
                'Remaining': 0
            };
            
            console.log(`Adding customer summary row for ${customerName}:`, rowData);
            allData.push(rowData);
        }
    });

    console.log('Total rows to export:', allData.length);
    console.log('Sample data:', allData.slice(0, 2));
    
    if (allData.length === 0) {
        console.error('No data rows generated for export');
        alert('No data available to export. Please check the report data.');
        return;
    }

    exportDailyCollectionToExcel(allData, filename);
};
