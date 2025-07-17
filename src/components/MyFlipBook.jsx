import React from 'react';
import HTMLFlipBook from 'react-pageflip';

const pages = [
    '/images/img1.png',
    '/images/img2.png',
    '/images/img3.png',
];

const MyFlipBook = () => {
    return (
        <div style={{ width: '100%', height: '100vh', background: '#ccc', display: 'flex', justifyContent: 'center' }}>
            <HTMLFlipBook width={400} height={600}>
                {pages.map((src, index) => (
                    <div key={index} className="page">
                        <img src={src} alt={`Page ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
};

export default MyFlipBook;
