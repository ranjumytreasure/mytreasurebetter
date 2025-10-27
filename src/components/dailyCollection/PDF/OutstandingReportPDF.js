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

const OutstandingReportPDF = ({
    tableData,
    tableHeaders,
    heading,
    companyData = {},
    reportDate,
    summaryData = {}
}) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <DailyCollectionPDFHeader
                    companyData={companyData}
                    reportTitle="Outstanding Report - Customer-wise Outstanding"
                    reportDate={reportDate}
                />

                {/* Summary Cards */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Outstanding Summary</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Customers</Text>
                            <Text style={styles.summaryValue}>{summaryData.totalCustomers || 0}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Outstanding</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(summaryData.totalOutstanding)}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Future Due</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(summaryData.totalFutureDue)}</Text>
                        </View>
                    </View>
                </View>

                {/* Detailed Table */}
                {tableData && tableData.length > 0 && (
                    <DailyCollectionPDFTable
                        tableHeaders={tableHeaders}
                        data={tableData}
                        heading="Customer-wise Outstanding Details"
                    />
                )}
            </Page>
        </Document>
    );
};

export default OutstandingReportPDF;
