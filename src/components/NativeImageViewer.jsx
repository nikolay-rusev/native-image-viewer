import React, { useState, useEffect, useRef } from "react";

export default function NativeImageViewer({ images }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomOptions = [1, 2, 3, 4];
  const [rotations, setRotations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const outerContainerRef = useRef(null);
  const imageRefs = useRef([]);
  const isProgrammaticScroll = useRef(false);

  const isZoomed = zoomLevel !== 1;

  useEffect(() => {
    setRotations(images?.map(() => 0)); // 0° rotation per image
  }, [images]);

  // smooth scroll changed element into view
  useEffect(() => {
    !isZoomed &&
      imageRefs?.current?.[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [activeIndex, isZoomed]);

  const handleZoomChange = (e) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  const handleRotate = (index) => {
    setRotations((prev) =>
      prev.map((rot, i) => (i === index ? (rot + 90) % 360 : rot)),
    );
  };

  const goToImage = (index) => {
    const el = imageRefs.current[index];
    if (!el) return;

    isProgrammaticScroll.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 400); // Adjust duration to match scroll speed

    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current || !outerContainerRef.current) return;

    const containerTop = outerContainerRef.current.getBoundingClientRect().top;

    let closestIndex = 0;
    let closestDistance = Infinity;

    imageRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const top = ref.getBoundingClientRect().top;
      const distance = Math.abs(top - containerTop);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#111",
        color: "#eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* Outer container with native scrollbars */}
      <div
        ref={outerContainerRef}
        onScroll={handleScroll}
        style={{
          width: "80vw",
          height: "70vh",
          overflowY: "auto",
          // overflowX: isZoomed ? "auto" : "hidden",
          borderRadius: 8,
          background: "#222",
          position: "relative",
        }}
      >
        {/* Inner zoomable container */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease",
            width: "100%",
          }}
        >
          {images?.map((src, i) => (
            <div
              key={"img-container" + i}
              ref={(el) => (imageRefs.current[i] = el)}
              style={{
                height: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                boxSizing: "border-box",
              }}
            >
              <img
                src={src}
                alt={`Page ${i + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  transform: `rotate(${rotations[i]}deg)`,
                  transition: "transform 0.3s ease",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 15, display: "flex", gap: 15 }}>
        <button
          onClick={() => goToImage(Math.max(activeIndex - 1, 0))}
          style={{ padding: "8px 12px" }}
        >
          Previous
        </button>
        <button
          onClick={() =>
            goToImage(Math.min(activeIndex + 1, images.length - 1))
          }
          style={{ padding: "8px 12px" }}
        >
          Next
        </button>

        <label>
          <span>Zoom:&nbsp;</span>
          <select value={zoomLevel} onChange={handleZoomChange}>
            {zoomOptions.map((z) => (
              <option key={z} value={z}>
                {z}00%
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => handleRotate(activeIndex)}
          style={{ padding: "8px 12px" }}
        >
          Rotate 90°
        </button>
      </div>
    </div>
  );
}
