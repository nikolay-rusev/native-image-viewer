// ImageViewerLikePDF.jsx
import React, { useState } from 'react';

const images = [
    '/images/img1.png',
    '/images/img2.png',
    '/images/img3.png',
];

const ImageViewerLikePDF = () => {
    const [page, setPage] = useState(0);

    const nextPage = () => {
        if (page < images.length - 1) setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', textAlign: 'center', background: '#f0f0f0' }}>
            <div style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={images[page]}
                    alt={`Page ${page + 1}`}
                    style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                />
            </div>
            <div style={{ padding: '10px' }}>
                <button onClick={prevPage} disabled={page === 0}>Previous</button>
                <span style={{ margin: '0 10px' }}>Page {page + 1} of {images.length}</span>
                <button onClick={nextPage} disabled={page === images.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default ImageViewerLikePDF;
