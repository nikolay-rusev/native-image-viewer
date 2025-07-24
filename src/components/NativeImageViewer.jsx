import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

function getScaleX(element) {
  const transform = getComputedStyle(element).transform;
  if (transform && transform !== "none") {
    const matrix = new DOMMatrix(transform);
    return matrix.a; // scaleX
  }
  return 1;
}

export default function NativeImageViewer({ images }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomOptions = [0.25, 0.5, 1, 2, 3, 4];
  const [rotations, setRotations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const outerContainerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const imageRefs = useRef([]);
  const isProgrammaticScroll = useRef(false);

  const isZoomed = zoomLevel !== 1;
  const isZoomedIn = zoomLevel > 1;
  const isZoomedOut = zoomLevel < 1;

  console.log("activeIndex: ", activeIndex);

  useEffect(() => {
    setRotations(images?.map(() => 0)); // 0° rotation per image
  }, [images]);

  // smooth scroll changed element into view
  useEffect(() => {
    const currentImage = imageRefs?.current?.[activeIndex];
    !isZoomed &&
      currentImage?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [activeIndex, isZoomed]);

  // on zoom in: center on x
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);

    setTimeout(() => {
      const container = outerContainerRef?.current;
      const innerContainer = innerContainerRef?.current;
      const item = imageRefs?.current?.[activeIndex];

      if (isZoomedIn && container && item) {
        const containerScale = getScaleX(container);
        const itemScale = getScaleX(innerContainer);

        // Adjusted measurements accounting for transforms
        const containerVisibleWidth = container.clientWidth / containerScale;
        const itemOffsetLeft = item.offsetLeft / containerScale;
        const itemWidth = item.offsetWidth * itemScale;

        const offset =
          itemOffsetLeft - containerVisibleWidth / 2 + itemWidth / 2;

        gsap.to(container, {
          scrollTo: { x: offset },
          duration: 0.1,
          ease: 'power2.out',
        });
      }
    }, 200);
  }, [isZoomedIn, zoomLevel]);

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
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Inner zoomable container */}
        <div
          ref={innerContainerRef}
          style={{
            transform: isZoomedIn ? `scale(${zoomLevel})` : ``,
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
                  transform: isZoomedOut
                    ? `scale(${zoomLevel}) rotate(${rotations[i]}deg)`
                    : `rotate(${rotations[i]}deg)`,
                  transition: "transform 0.2s ease",
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

        <div>Selected #{activeIndex + 1}</div>

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
                {z * 100}%
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
