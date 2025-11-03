import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
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
                    <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                        {/* Customer Photo */}
                        {(subscriber.dc_cust_photo_base64format || subscriber.dc_cust_photo) && (
                            <View style={{ marginRight: 15, marginBottom: 10 }}>
                                {/* eslint-disable-next-line react/jsx-no-undef */}
                                <Image
                                    src={subscriber.dc_cust_photo_base64format || subscriber.dc_cust_photo || ''}
                                    style={{ width: 80, height: 80, borderRadius: 4 }}
                                />
                            </View>
                        )}
                        <View style={{ flex: 1 }}>
                            <View style={styles.detailsGrid}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Name:</Text>
                                    <Text style={styles.detailValue}>{subscriber.dc_cust_name || subscriber.name || subscriber.firstname || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Date of Birth:</Text>
                                    <Text style={styles.detailValue}>{subscriber.dc_cust_dob ? formatDate(subscriber.dc_cust_dob) : 'N/A'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Age:</Text>
                                    <Text style={styles.detailValue}>{subscriber.dc_cust_age || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Mobile Number:</Text>
                                    <Text style={styles.detailValue}>{subscriber.dc_cust_phone || 'N/A'}</Text>
                                </View>
                                <View style={{ width: '100%', marginTop: 5 }}>
                                    <Text style={styles.detailLabel}>Address:</Text>
                                    <Text style={styles.detailValue}>{subscriber.dc_cust_address || subscriber.street_name || 'N/A'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Nominee Details */}
                    <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0' }}>
                        <Text style={[styles.sectionTitle, { fontSize: 12, marginBottom: 8 }]}>NOMINEE DETAILS</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Nominee Name:</Text>
                                <Text style={styles.detailValue}>{subscriber.dc_nominee_name || 'N/A'}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Nominee Phone:</Text>
                                <Text style={styles.detailValue}>{subscriber.dc_nominee_phone || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Identity Section - Aadhaar Cards */}
                {(subscriber.dc_cust_aadhaar_frontside_base64format || subscriber.dc_cust_aadhaar_frontside ||
                    subscriber.dc_cust_aadhaar_backside_base64format || subscriber.dc_cust_aadhaar_backside) && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>IDENTITY</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                {/* Aadhaar Front Side */}
                                {(subscriber.dc_cust_aadhaar_frontside_base64format || subscriber.dc_cust_aadhaar_frontside) && (
                                    <View style={{ width: '48%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 9, marginBottom: 5, fontWeight: 'bold', color: '#424242' }}>Aadhaar Card - Front Side</Text>
                                        {/* eslint-disable-next-line react/jsx-no-undef */}
                                        <Image
                                            src={subscriber.dc_cust_aadhaar_frontside_base64format || subscriber.dc_cust_aadhaar_frontside || ''}
                                            style={{ width: '100%', height: 120, borderRadius: 4, borderWidth: 1, borderColor: '#e0e0e0' }}
                                        />
                                    </View>
                                )}

                                {/* Aadhaar Back Side */}
                                {(subscriber.dc_cust_aadhaar_backside_base64format || subscriber.dc_cust_aadhaar_backside) && (
                                    <View style={{ width: '48%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 9, marginBottom: 5, fontWeight: 'bold', color: '#424242' }}>Aadhaar Card - Back Side</Text>
                                        {/* eslint-disable-next-line react/jsx-no-undef */}
                                        <Image
                                            src={subscriber.dc_cust_aadhaar_backside_base64format || subscriber.dc_cust_aadhaar_backside || ''}
                                            style={{ width: '100%', height: 120, borderRadius: 4, borderWidth: 1, borderColor: '#e0e0e0' }}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

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

                {/* Terms and Conditions */}
                <View style={styles.terms}>
                    <Text style={styles.termsTitle}>TERMS AND CONDITIONS</Text>
                    <Text style={styles.termItem}>
                        1. The Borrower agrees to repay the loan amount as per the agreed payment schedule.
                    </Text>
                    <Text style={styles.termItem}>
                        2. Late payment charges may apply for overdue amounts as per company policy.
                    </Text>
                    <Text style={styles.termItem}>
                        3. The Borrower must notify the Company immediately of any change in contact information.
                    </Text>
                    <Text style={styles.termItem}>
                        4. This agreement is subject to the terms and conditions of {companyData.companyName || companyData.name || 'MyTreasure Finance Hub'}.
                    </Text>
                    <Text style={styles.termItem}>
                        5. Any dispute shall be subject to the jurisdiction of courts in {companyData.district || 'local jurisdiction'}.
                    </Text>
                </View>

                {/* Declaration */}
                <View style={[styles.terms, { backgroundColor: '#f3e5f5', borderColor: '#9c27b0' }]}>
                    <Text style={[styles.termsTitle, { color: '#7b1fa2' }]}>DECLARATION</Text>
                    <Text style={styles.termItem}>
                        I, <Text style={{ fontWeight: 'bold' }}>{subscriber.dc_cust_name || subscriber.name || subscriber.firstname || 'Borrower'}</Text>, hereby declare that:
                    </Text>
                    <Text style={styles.termItem}>
                        1. All the information provided by me in this loan application is true and correct to the best of my knowledge.
                    </Text>
                    <Text style={styles.termItem}>
                        2. I understand all the terms and conditions mentioned in this agreement and agree to abide by them.
                    </Text>
                    <Text style={styles.termItem}>
                        3. I acknowledge that I have received the loan amount of {formatCurrency(loan.principal_amount)} and agree to repay it as per the schedule.
                    </Text>
                    <Text style={styles.termItem}>
                        4. I authorize {companyData.companyName || companyData.name || 'the Company'} to verify the information provided by me and take necessary legal action in case of default.
                    </Text>
                    <Text style={styles.termItem}>
                        5. I have read and understood all the clauses of this agreement before signing.
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

