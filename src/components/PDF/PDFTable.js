import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const PDFTable = ({
    data,
    heading,
    tableHeaders,
    extraStyle,
}) => {
    const styles = StyleSheet.create({
        table: {
            width: "100%",
            marginBottom: 20,
            borderRadius: 4,
            marginTop: 10,
            border: extraStyle ? "" : "1px solid #e0e0e0",
        },
        row: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
            alignItems: "center",
            minHeight: 30,
            flexWrap: "wrap",
            ":not(:last-child)": {
                borderBottom: "none",
            },
        },
        rowHead: {
            flexDirection: "row",
        },
        cell: {
            flex: 1,
            padding: 8,
            fontSize: 11,
            color: "#424242",
            textTransform: "capitalize",
            alignItems: "center",
        },
        headerCell: {
            backgroundColor: "#DAF7A6",
            fontWeight: "bold",
            overflow: "hidden",
            whiteSpace: "nowrap",
            alignItems: "center",
        },
        snCell: {
            flex: 0.4,
            padding: "8px 4px",
            fontSize: 11,
            color: "#424242",
            backgroundColor: "#DAF7A6",
            fontWeight: 700,
            flexWrap: "wrap",
        },
        snRow: {
            flex: 0.4,
            padding: "8px 4px",
            fontSize: 11,
            color: "#424242",
            fontWeight: "bold",
        },
        innerHeading: {
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 12,
            marginTop: 12,
        },
    });

    // Add safety checks for data and tableHeaders
    const safeData = Array.isArray(data) ? data : [];
    const safeTableHeaders = Array.isArray(tableHeaders) ? tableHeaders : [];
    const safeHeading = heading || "Report";

    return (
        <View wrap={true}>
            <Text style={styles.innerHeading}>{safeHeading}</Text>
            <View style={styles.table}>
                {/* Table Headers */}
                <View style={[styles.rowHead, { justifyContent: "space-between" }]}>
                    <Text style={styles.snCell}>S.N</Text>
                    {safeTableHeaders.map((thead, headerIndex) => (
                        <Text key={thead?.title || headerIndex} style={[styles.cell, styles.headerCell]}>
                            {thead?.title || ""}
                        </Text>
                    ))}
                </View>

                {/* Table content */}
                {safeData.map((item, dataIndex) => (
                    <View key={dataIndex}>
                        <View style={styles.row}>
                            <Text style={styles.snRow}>{dataIndex + 1}.</Text>
                            {safeTableHeaders.map((header, headerIndex) => {
                                // Safe value extraction with fallback
                                const value = item && header?.value ? item[header.value] : "";
                                const displayValue = header?.render
                                    ? header.render(value, item, dataIndex)
                                    : value ?? "";

                                return (
                                    <Text style={styles.cell} key={headerIndex}>
                                        {String(displayValue || "")}
                                    </Text>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PDFTable;
