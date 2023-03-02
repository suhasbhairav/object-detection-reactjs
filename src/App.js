import React, {useState, useEffect, useRef} from 'react';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';

function App() {
  const [model, setModel] = useState(null);
  const webCamRef = useRef(null);
  const [videoHeight, setVideoHeight] = useState(640);
  const [videoWidth, setVideoWidth] = useState(960);

  const videoConstraints = {
    height: 640,
    width: 960,
    facingMode: "environment",
  };



  const loadTFJSModel = async () => {
    try {
      const model = await cocoSSD.load();
      setModel(model);
      console.log('Loaded model...');
    } catch (error) {
      console.log("Error while loading model:", error);
    }
  };

  const startDetection = async () => {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0, webCamRef.current.video.videoWidth,webCamRef.current.video.videoHeight);

    const predictions = await model.detect(document.getElementById("img"));
    if (predictions.length > 0) {
    for(var x = 0; x < predictions.length; x++){
      if (predictions[x].score > 0.8) {
      let bBoxLeft = predictions[x].bbox[0];
      let bBoxTop = predictions[x].bbox[1];
      let bBoxWidth = predictions[x].bbox[2];
      let bBoxHeight = predictions[x].bbox[3] - bBoxTop;

      ctx.beginPath();
      ctx.font = "35px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(predictions[x].class +": " + Math.round(parseFloat(predictions[x].score) * 100) +"%", bBoxLeft,bBoxTop);
      ctx.rect(bBoxLeft, bBoxTop-150, bBoxWidth, bBoxHeight);
      ctx.strokeStyle = "##ffe300";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  }
  setTimeout(() => startDetection(), 500);
  };

  useEffect(() => {
    tf.ready().then(() => {
      loadTFJSModel();
    })
  }, []);
  
  return (
    <div>
        <button style={{ position: "absolute", left: '650px',}} onClick={() => startDetection()}>Begin Detection</button>
        <div style={{ position: "absolute", top: "50px", left: '250px' }}>
          <Webcam
            audio={false}
            id="img"
            ref={webCamRef}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </div>
        <div style={{ position: "absolute", top: "200px", left: '250px', zIndex: "9999" }}>
          <canvas 
          width={videoWidth}
          height={videoHeight}
          style={{ backgroundColor: "transparent" }}
          id="myCanvas"
          />
        </div>
    </div>
  );
}

export default App;
