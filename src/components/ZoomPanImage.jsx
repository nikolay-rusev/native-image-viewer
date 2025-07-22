import React, { useRef, useState, useEffect } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ZoomPanImage = ({ src, width = 800, height = 600 }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const lastTouchDistance = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const zoomAmount = -e.deltaY * 0.001;
    const newScale = clamp(scale * (1 + zoomAmount), 0.5, 5);
    const ratio = newScale / scale;

    const newTranslate = {
      x: (translate.x - cursorX) * ratio + cursorX,
      y: (translate.y - cursorY) * ratio + cursorY,
    };

    setScale(newScale);
    setTranslate(newTranslate);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...translate };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTranslate({
      x: offsetStart.current.x + dx,
      y: offsetStart.current.y + dy,
    });
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const handleDoubleClick = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  // Touch support
  const getDistance = (touches) => {
    const [a, b] = touches;
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastTouchDistance.current = getDistance(e.touches);
    } else if (e.touches.length === 1) {
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      offsetStart.current = { ...translate };
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const newDistance = getDistance(e.touches);
      const zoomRatio = newDistance / lastTouchDistance.current;
      const newScale = clamp(scale * zoomRatio, 0.5, 5);
      lastTouchDistance.current = newDistance;
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setTranslate({
        x: offsetStart.current.x + dx,
        y: offsetStart.current.y + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    lastTouchDistance.current = null;
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
        cursor: isDragging.current ? "grabbing" : "grab",
        background: "#fff",
        touchAction: "none",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        ref={imageRef}
        src={src}
        alt="Zoomable"
        draggable={false}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "top left",
          userSelect: "none",
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default ZoomPanImage;
