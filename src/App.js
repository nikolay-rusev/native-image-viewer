import "./App.css";
import SwiperViewer from "./components/SwiperViewer";
import ZoomPanImage from "./components/ZoomPanImage";
import NativeImageViewer from "./components/NativeImageViewer";

function App() {
  // return (
  //   <ZoomPanImage
  //     images={["images/img1.png", "images/img2.png", "images/img3.png"]}
  //   />
  // );
  // return <SwiperViewer />;
  return <NativeImageViewer />
}

export default App;
