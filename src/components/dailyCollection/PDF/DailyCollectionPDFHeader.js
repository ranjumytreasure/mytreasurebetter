import React from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    logo: {
        width: 60,
        height: 60,
    },
    companyInfo: {
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    companyAddress: {
        fontSize: 9,
        marginTop: 2,
    },
    registration: {
        fontSize: 8,
        marginTop: 2,
        fontStyle: 'italic',
    },
    reportInfo: {
        textAlign: 'right',
        fontSize: 10,
    },
    reportTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    reportDate: {
        fontSize: 9,
        color: '#666',
    },
});

const DailyCollectionPDFHeader = ({ companyData, reportTitle, reportDate }) => {
    const {
        // Daily Collection company fields
        company_logo,
        company_logo_base64format,
        company_name,
        contact_no,
        address,
        // Fallback to chit fund company fields
        logo_base64format,
        name,
        registration_no,
        company_since,
        street_address,
        city,
        state,
        zipcode,
        country,
        email,
        phone,
    } = companyData || {};

    // Use daily collection fields first, then fallback to chit fund fields
    // Check for base64 format (for PDF) first, then fallback to regular logo
    const logo = company_logo_base64format || company_logo || logo_base64format;
    const companyName = company_name || name || 'Daily Collection Company';
    const contact = contact_no || phone || 'N/A';
    const companyAddress = address || `${street_address || ''}, ${city || ''}, ${state || ''} - ${zipcode || ''}, ${country || ''}`;

    return (
        <View style={styles.headerContainer}>
            {logo && <Image style={styles.logo} src={logo} />}
            <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{companyName}</Text>
                <Text style={styles.companyAddress}>{companyAddress}</Text>
                <Text style={styles.registration}>Reg No: {registration_no || 'N/A'} | Since: {company_since || 'N/A'}</Text>
                <Text style={styles.companyAddress}>Email: {email || 'N/A'} | Phone: {contact}</Text>
            </View>
            <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{reportTitle || 'Daily Collection Report'}</Text>
                <Text style={styles.reportDate}>Generated: {reportDate || new Date().toLocaleDateString()}</Text>
            </View>
        </View>
    );
};

export default DailyCollectionPDFHeader;
