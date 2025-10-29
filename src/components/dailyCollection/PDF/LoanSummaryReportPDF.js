import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import DailyCollectionPDFHeader from './DailyCollectionPDFHeader';
import DailyCollectionPDFTable from './DailyCollectionPDFTable';

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 48,
        paddingHorizontal: 48,
        boxSizing: "border-box",
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    summarySection: {
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 15,
    },
    summaryCard: {
        width: "48%",
        margin: "1%",
        padding: 10,
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: 4,
    },
    summaryLabel: {
        fontSize: 10,
        color: "#666",
        marginBottom: 2,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
        borderBottom: "1px solid #ccc",
        paddingBottom: 5,
    },
});

const LoanSummaryReportPDF = ({
    tableData,
    tableHeaders,
    heading,
    companyData = {},
    reportDate,
    summaryData = {}
}) => {
    const formatCurrency = (amount) => {
        // Use Rs. instead of ₹ for PDF compatibility (avoids ¹ symbol)
        const num = Number(amount || 0);
        const formatted = num.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return `Rs. ${formatted}`;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <DailyCollectionPDFHeader
                    companyData={companyData}
                    reportTitle="Loan Summary Report"
                    reportDate={reportDate}
                />

                {/* Summary Cards */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Summary Overview</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Loans</Text>
                            <Text style={styles.summaryValue}>{summaryData.totalLoans || 0}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Active Loans</Text>
                            <Text style={styles.summaryValue}>{summaryData.activeLoans || 0}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Completed Loans</Text>
                            <Text style={styles.summaryValue}>{summaryData.completedLoans || 0}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Overdue Loans</Text>
                            <Text style={styles.summaryValue}>{summaryData.overdueLoans || 0}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Disbursed</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(summaryData.totalDisbursed)}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Collected</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(summaryData.totalCollected)}</Text>
                        </View>
                    </View>
                </View>

                {/* Detailed Table */}
                {tableData && tableData.length > 0 && (
                    <DailyCollectionPDFTable
                        tableHeaders={tableHeaders}
                        data={tableData}
                        heading="Loan Details"
                    />
                )}
            </Page>
        </Document>
    );
};

export default LoanSummaryReportPDF;
