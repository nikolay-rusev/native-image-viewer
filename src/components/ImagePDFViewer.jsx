// ImagePDFViewer.jsx
import React from 'react';
import { Document, Page, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Example image list (could be URLs or base64)
const imageList = [
    '/images/img1.png',
    '/images/img2.png',
    '/images/img3.png',
];

// Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
    },
    viewer: {
        width: '100%',
        height: '100vh',
    },
});

// Component
const ImagePDFViewer = () => (
    <PDFViewer style={styles.viewer}>
        <Document>
            {imageList.map((src, index) => (
                <Page size="A4" style={styles.page} key={index}>
                    <Image src={src} style={styles.image} />
                </Page>
            ))}
        </Document>
    </PDFViewer>
);

export default ImagePDFViewer;
