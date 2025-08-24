import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PDFHeader from './PDFHeader'; // Your existing header component

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#003366',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    rightAlignedText: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    billDateInline: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    fieldGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    fieldBox: {
        width: '48%',
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 10,
        marginBottom: 4,
    },
    value: {
        fontSize: 10,
        color: '#000',
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#777',
        fontStyle: 'italic',
    },
});

const Field = ({ label, value }) => (
    <View style={styles.fieldBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '-'}</Text>
    </View>
);

const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
};




const ReceivableReceitPdf = ({ receivableData = {}, companyData = {} }) => {
    const today = new Date().toLocaleDateString();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <PDFHeader companyData={companyData} />

                {/* Section Title with Date */}
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Receivable Details</Text>
                    <View style={styles.rightAlignedText}>
                        <Text style={styles.billDateInline}>Bill Date: {today}</Text>
                    </View>
                </View>

                {/* Data Fields */}
                <View style={styles.fieldGrid}>
                    <Field label="Name" value={receivableData.subscriberName} />
                    <Field label="Payment Type" value={receivableData.paymentType} />
                    <Field label="Payment Method" value={receivableData.paymentMethod} />
                    <Field label="Group Name" value={receivableData.groupName} />
                    <Field label="Auction Date" value={receivableData.auctionDate} />
                    <Field
                        label="Total Bill"
                        value={formatCurrency(receivableData.paymentAmount)}
                    />



                </View>

                {/* Footer Note */}
                <Text style={styles.footer}>Thank you for your payment!</Text>
            </Page>
        </Document>
    );
};

export default ReceivableReceitPdf;
