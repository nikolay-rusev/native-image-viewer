import "./App.css";
import SwiperViewer from "./components/SwiperViewer";
import ZoomPanImage from "./components/ZoomPanImage";

function App() {
  return (
    <ZoomPanImage
      images={["images/img1.png", "images/img2.png", "images/img3.png"]}
    />
  );
  // return <SwiperViewer />;
}

export default App;
