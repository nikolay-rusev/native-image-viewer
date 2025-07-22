import React, { useRef, useState } from "react";

const ZoomPanCanvas = ({ images, width = 800, height = 600 }) => {
  const containerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.5), 5);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOffsetStart({ ...translate });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setTranslate({
      x: offsetStart.x + dx,
      y: offsetStart.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        overflow: "hidden",
        border: "2px solid #ccc",
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
        background: "#fff",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          gap: "16px", // spacing between images
          padding: "16px",
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index}`}
            draggable={false}
            style={{
              maxWidth: "100%",
              height: "auto",
              userSelect: "none",
              pointerEvents: "auto",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ZoomPanCanvas;
