import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import DailyCollectionPDFHeader from './DailyCollectionPDFHeader';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        backgroundColor: '#e3f2fd',
        padding: 8,
        borderRadius: 4,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    detailItem: {
        width: '50%',
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 10,
    },
    detailLabel: {
        fontWeight: 'bold',
        width: '45%',
        color: '#1976d2',
    },
    detailValue: {
        width: '55%',
        color: '#424242',
    },
    table: {
        width: '100%',
        marginBottom: 20,
        marginTop: 10,
        border: '1px solid #e0e0e0',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1976d2',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        padding: 8,
        borderBottom: '1px solid #e0e0e0',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #e0e0e0',
        minHeight: 30,
        alignItems: 'center',
    },
    tableRowAlt: {
        backgroundColor: '#f5f5f5',
    },
    tableCell: {
        padding: 6,
        fontSize: 9,
    },
    col1: { width: '15%' },
    col2: { width: '28%' },
    col3: { width: '28%' },
    col4: { width: '29%' },
    terms: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff3e0',
        borderRadius: 4,
    },
    termsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#e65100',
    },
    termItem: {
        fontSize: 9,
        marginBottom: 5,
        paddingLeft: 10,
        color: '#424242',
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 20,
        borderTop: '1px solid #e0e0e0',
    },
    signatureBox: {
        width: '45%',
    },
    signatureLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    signatureLine: {
        borderTop: '1px solid #000',
        paddingTop: 5,
        fontSize: 9,
        color: '#666',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#999',
        borderTop: '1px solid #e0e0e0',
        paddingTop: 10,
    },
    summaryBox: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 4,
        marginBottom: 15,
        border: '1px solid #4caf50',
    },
    summaryTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#424242',
    },
    summaryValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1b5e20',
    },
    noteBox: {
        backgroundColor: '#fff9c4',
        padding: 8,
        borderRadius: 4,
        marginTop: 10,
        border: '1px solid #fbc02d',
    },
    noteText: {
        fontSize: 8,
        color: '#f57f17',
        fontStyle: 'italic',
    },
});

const LoanAgreementPDF = ({ loanData, companyData }) => {
    const formatCurrency = (amount) => {
        // Use Rs. instead of ₹ for PDF compatibility
        const num = Number(amount || 0);
        const formatted = num.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return `Rs. ${formatted}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const { loan, subscriber, product, receivables, cashInHand, perCycleDue } = loanData;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <DailyCollectionPDFHeader
                    companyData={companyData}
                    reportTitle="Loan Agreement"
                    reportDate={formatDate(loan.loan_disbursement_date)}
                />

                <Text style={styles.title}>Loan Disbursement Agreement</Text>

                {/* Loan Summary Box */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Loan Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Loan ID:</Text>
                        <Text style={styles.summaryValue}>{loan.id || 'N/A'}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Loan Amount:</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(loan.principal_amount)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Cash in Hand:</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(loan.cash_in_hand || cashInHand)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Per Cycle Due:</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(loan.daily_due_amount || perCycleDue)}</Text>
                    </View>
                </View>

                {/* Borrower Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>BORROWER DETAILS</Text>
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Name:</Text>
                            <Text style={styles.detailValue}>{subscriber.name || subscriber.firstname}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Phone:</Text>
                            <Text style={styles.detailValue}>{subscriber.phone}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Email:</Text>
                            <Text style={styles.detailValue}>{subscriber.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Address:</Text>
                            <Text style={styles.detailValue}>{subscriber.street_name || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Loan Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>LOAN DETAILS</Text>
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Product:</Text>
                            <Text style={styles.detailValue}>{product.product_name}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Interest Rate:</Text>
                            <Text style={styles.detailValue}>{product.interest_rate || 0}%</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Disbursement Date:</Text>
                            <Text style={styles.detailValue}>{formatDate(loan.loan_disbursement_date)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>First Due Date:</Text>
                            <Text style={styles.detailValue}>{formatDate(loan.loan_due_start_date)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Payment Method:</Text>
                            <Text style={styles.detailValue}>{loan.payment_method}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Total Installments:</Text>
                            <Text style={styles.detailValue}>{receivables.length}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Frequency:</Text>
                            <Text style={styles.detailValue}>{product.frequency}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Duration:</Text>
                            <Text style={styles.detailValue}>{product.duration} {product.frequency}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Schedule Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAYMENT SCHEDULE</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, styles.col1]}>Cycle</Text>
                            <Text style={[styles.tableCell, styles.col2]}>Due Date</Text>
                            <Text style={[styles.tableCell, styles.col3]}>Due Amount</Text>
                            <Text style={[styles.tableCell, styles.col4]}>Balance</Text>
                        </View>
                        {receivables.slice(0, 15).map((rec, idx) => (
                            <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                                <Text style={[styles.tableCell, styles.col1]}>#{rec.cycle}</Text>
                                <Text style={[styles.tableCell, styles.col2]}>{formatDate(rec.due_date)}</Text>
                                <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(rec.due_amount)}</Text>
                                <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(rec.closing_balance)}</Text>
                            </View>
                        ))}
                    </View>
                    {receivables.length > 15 && (
                        <View style={styles.noteBox}>
                            <Text style={styles.noteText}>
                                Note: Showing first 15 installments. Total {receivables.length} installments.
                                Full schedule available in loan details.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Terms and Conditions */}
                <View style={styles.terms}>
                    <Text style={styles.termsTitle}>TERMS AND CONDITIONS</Text>
                    <Text style={styles.termItem}>
                        1. The Borrower agrees to repay the loan amount as per the payment schedule above.
                    </Text>
                    <Text style={styles.termItem}>
                        2. Late payment charges may apply for overdue amounts as per company policy.
                    </Text>
                    <Text style={styles.termItem}>
                        3. The Borrower must notify the Company immediately of any change in contact information.
                    </Text>
                    <Text style={styles.termItem}>
                        4. This agreement is subject to the terms and conditions of {companyData.companyName || 'MyTreasure Finance Hub'}.
                    </Text>
                    <Text style={styles.termItem}>
                        5. Any dispute shall be subject to the jurisdiction of courts in {companyData.district || 'local jurisdiction'}.
                    </Text>
                </View>

                {/* Signature Section */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>BORROWER SIGNATURE</Text>
                        <View style={styles.signatureLine}>
                            <Text>Signature: _________________</Text>
                        </View>
                        <View style={[styles.signatureLine, { marginTop: 10 }]}>
                            <Text>Date: _________________</Text>
                        </View>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>AUTHORIZED SIGNATURE</Text>
                        <View style={styles.signatureLine}>
                            <Text>Signature: _________________</Text>
                        </View>
                        <View style={[styles.signatureLine, { marginTop: 10 }]}>
                            <Text>Date: _________________</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    This is a computer-generated document. For any queries, please contact {companyData.companyName || 'MyTreasure Finance Hub'}
                    {companyData.phone ? ` at ${companyData.phone}` : ''}
                </Text>
            </Page>
        </Document>
    );
};

export default LoanAgreementPDF;

