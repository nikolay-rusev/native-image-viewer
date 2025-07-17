import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Keyboard, Mousewheel, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/scrollbar';

const images = [
    '/images/img1.png',
    '/images/img2.png',
    '/images/img3.png',
];

export default function SwiperViewer() {
    const [zoomLevel, setZoomLevel] = useState(1);
    const zoomOptions = [1, 1.5, 2, 2.5, 3];

    const [rotations, setRotations] = useState(images.map(() => 0));
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    const handleZoomChange = (e) => {
        const newZoom = parseFloat(e.target.value);
        setZoomLevel(newZoom);
    };

    const handleRotate = (index) => {
        setRotations((prev) =>
            prev.map((rot, i) => (i === index ? (rot + 90) % 360 : rot))
        );
    };

    const goPrev = () => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    };

    const goNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext();
    };

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: '#111',
            color: '#eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Swiper
                modules={[Navigation, Pagination, Zoom, Keyboard, Mousewheel, Scrollbar]}
                direction="vertical"
                slidesPerView={1}
                spaceBetween={30}
                keyboard={{ enabled: true }}
                mousewheel={{ forceToAxis: true }}
                scrollbar={{ draggable: true }}
                // pagination={{ clickable: true }}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                style={{
                    width: '80vw',
                    height: '70vh',
                    background: '#222',
                    borderRadius: 8,
                    overflow: 'hidden'
                }}
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i}>
                        <div
                            className="swiper-zoom-container"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                paddingTop: `${zoomLevel * 20}px`,
                                paddingBottom: `${zoomLevel * 20}px`,
                                boxSizing: 'border-box',
                            }}
                        >
                            <img
                                src={src}
                                alt={`Page ${i + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    transform: `scale(${zoomLevel}) rotate(${rotations[i]}deg)`,
                                    transition: 'transform 0.3s ease',
                                    userSelect: 'none',
                                }}
                                draggable={false}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div style={{
                marginTop: 15,
                display: 'flex',
                gap: 15,
                alignItems: 'center'
            }}>
                <button onClick={goPrev} style={{ padding: '8px 12px' }}>Previous</button>
                <button onClick={goNext} style={{ padding: '8px 12px' }}>Next</button>

                <label>
                    Zoom:&nbsp;
                    <select value={zoomLevel} onChange={handleZoomChange}>
                        {zoomOptions.map((z) => (
                            <option key={z} value={z}>{z}x</option>
                        ))}
                    </select>
                </label>

                <button onClick={() => handleRotate(activeIndex)} style={{ padding: '8px 12px' }}>Rotate 90°</button>
            </div>
        </div>
    );
}
