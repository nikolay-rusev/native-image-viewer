import "./App.css";
import NativeImageViewer from "./components/NativeImageViewer";
import { useEffect, useState } from "react";

const imageUrls = [
  "/images/img1.png",
  "/images/img2.png",
  "/images/img3.png",
  "/images/example.jpg",
  "/images/example1.png",
  "/images/example2.png",
  "/images/example3.png",
  "/images/example4.jpg",
  "/images/example5.png",
];

function App() {
  const [images, setImages] = useState([]);

  // load images
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
    };

    loadImages();

    return () => {
      images.forEach((src) => URL.revokeObjectURL(src));
    };
  }, []);

  return <NativeImageViewer images={images} />;
}

export default App;
