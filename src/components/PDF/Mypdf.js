import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import PDFTable from './PDFTable';
import PDFHeader from './PDFHeader';
import logo from '../../assets/logo.png'

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
    logo: {
        width: '20%',
        padding: 10,
    },
});



const Mypdf = ({ tableData, tableHeaders, heading,  companyData = {} }) => {
   

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PDFHeader  companyData={companyData}  />
                <View>

                    <PDFTable
                        tableHeaders={tableHeaders}
                        data={tableData}
                        heading={heading}
                    />
                </View>
            </Page>
        </Document>
    );
};

export default Mypdf;
