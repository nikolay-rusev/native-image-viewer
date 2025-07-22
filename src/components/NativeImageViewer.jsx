import React, { useState, useEffect, useRef } from "react";

const imageUrls = ["/images/img1.png", "/images/img2.png", "/images/img3.png"];

export default function NativeImageViewer() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomOptions = [1, 1.5, 2, 2.5, 3];

  const [rotations, setRotations] = useState([]);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const outerContainerRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const loadImages = async () => {
      const blobs = await Promise.all(
        imageUrls.map(async (url) => {
          const res = await fetch(url);
          const blob = await res.blob();
          return URL.createObjectURL(blob);
        }),
      );
      setImages(blobs);
      setRotations(blobs.map(() => 0)); // 0° rotation per image
    };

    loadImages();

    return () => {
      images.forEach((src) => URL.revokeObjectURL(src));
    };
  }, []);

  const handleZoomChange = (e) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  const handleRotate = (index) => {
    setRotations((prev) =>
      prev.map((rot, i) => (i === index ? (rot + 90) % 360 : rot)),
    );
  };

  const goToImage = (index) => {
    if (imageRefs.current[index]) {
      imageRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (!outerContainerRef.current) return;

    const containerTop = outerContainerRef.current.getBoundingClientRect().top;

    let closestIndex = 0;
    let closestDistance = Infinity;

    imageRefs.current.forEach((ref, index) => {
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
          borderRadius: 8,
          background: "#222",
          scrollSnapType: "y proximity",
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
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => (imageRefs.current[i] = el)}
              style={{
                scrollSnapAlign: "start",
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
                {z}x
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
