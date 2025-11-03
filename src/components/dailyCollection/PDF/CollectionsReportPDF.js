import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import DailyCollectionPDFHeader from './DailyCollectionPDFHeader';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
    },
    section: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
    },
    table: {
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 8,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableCell: {
        flex: 1,
        paddingHorizontal: 5,
        fontSize: 8,
    },
    tableCellSmall: {
        flex: 0.8,
        paddingHorizontal: 5,
        fontSize: 8,
    },
    tableCellLarge: {
        flex: 1.5,
        paddingHorizontal: 5,
        fontSize: 8,
    },
    summary: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    summaryValue: {
        fontSize: 10,
    },
    statusBadge: {
        padding: 4,
        borderRadius: 3,
        fontSize: 7,
    },
    paid: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    today: {
        backgroundColor: '#cce5ff',
        color: '#004085',
    },
    overdue: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
    future: {
        backgroundColor: '#e2e3e5',
        color: '#383d41',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 10,
    },
});

const CollectionsReportPDF = ({ receivables = [], companyData = {}, filters = {} }) => {
    const today = new Date().toISOString().split('T')[0];

    // Calculate totals
    const totalAmount = receivables.reduce((sum, r) => sum + parseFloat(r.due_amount || r.amount || 0), 0);
    const paidCount = receivables.filter(r => r.is_paid).length;
    const overdueCount = receivables.filter(r => !r.is_paid && r.due_date < today).length;
    const todayDueCount = receivables.filter(r => !r.is_paid && r.due_date === today).length;

    const formatCurrency = (amount) => {
        // Use Rs. instead of ₹ for PDF compatibility (avoids ¹ symbol)
        const num = Number(amount || 0);
        if (isNaN(num)) return 'Rs. 0.00';
        const formatted = num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `Rs. ${formatted}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatus = (receivable) => {
        if (receivable.is_paid) return { text: 'Paid', style: styles.paid };
        if (receivable.due_date === today) return { text: "Today's Due", style: styles.today };
        if (receivable.due_date < today) return { text: 'Overdue', style: styles.overdue };
        return { text: 'Future', style: styles.future };
    };

    const reportTitle = filters.status === 'all' ? "Collections Report - Today's Due + Overdue" :
        filters.status === 'today' ? "Collections Report - Today's Due" :
            filters.status === 'overdue' ? "Collections Report - Overdue" :
                filters.status === 'future' ? "Collections Report - Future Due" :
                    "Collections Report";

    const reportDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <DailyCollectionPDFHeader
                    companyData={companyData}
                    reportTitle={reportTitle}
                    reportDate={reportDate}
                />

                {/* Summary Section */}
                <View style={styles.summary}>
                    <Text style={styles.subtitle}>Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Receivables:</Text>
                        <Text style={styles.summaryValue}>{receivables.length}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Amount Due:</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Paid:</Text>
                        <Text style={styles.summaryValue}>{paidCount}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Today's Due:</Text>
                        <Text style={styles.summaryValue}>{todayDueCount}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Overdue:</Text>
                        <Text style={styles.summaryValue}>{overdueCount}</Text>
                    </View>
                </View>

                {/* Receivables Table */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Receivables Details</Text>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCellSmall}>S.No</Text>
                            <Text style={styles.tableCellLarge}>Subscriber</Text>
                            <Text style={styles.tableCell}>Phone</Text>
                            <Text style={styles.tableCell}>Product</Text>
                            <Text style={styles.tableCellSmall}>Amount</Text>
                            <Text style={styles.tableCellSmall}>Due Date</Text>
                            <Text style={styles.tableCellSmall}>Status</Text>
                        </View>

                        {/* Table Rows */}
                        {receivables.map((receivable, index) => {
                            const status = getStatus(receivable);
                            return (
                                <View key={receivable.id || index} style={styles.tableRow}>
                                    <Text style={styles.tableCellSmall}>{index + 1}</Text>
                                    <Text style={styles.tableCellLarge}>
                                        {receivable.subscriber?.name ||
                                            receivable.subscriber?.firstname ||
                                            receivable.subscriber?.dc_cust_name ||
                                            'N/A'}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {receivable.subscriber?.phone ||
                                            receivable.subscriber?.dc_cust_phone ||
                                            'N/A'}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {receivable.product?.product_name || 'N/A'}
                                    </Text>
                                    <Text style={styles.tableCellSmall}>
                                        {formatCurrency(receivable.due_amount || receivable.amount)}
                                    </Text>
                                    <Text style={styles.tableCellSmall}>
                                        {formatDate(receivable.due_date)}
                                    </Text>
                                    <Text style={[styles.tableCellSmall, styles.statusBadge, status.style]}>
                                        {status.text}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Generated on {reportDate} | This is an auto-generated report
                </Text>
            </Page>
        </Document>
    );
};

export default CollectionsReportPDF;

