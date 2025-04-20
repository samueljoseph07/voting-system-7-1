import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceCapture = ({ onFaceCapture, mode = 'capture' }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
  const [capturedFace, setCapturedFace] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading face detection models...');
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        
        console.log('Models loaded successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading models:', error);
        setError('Failed to load face detection models. Please check your internet connection and refresh the page.');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      startVideo();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isInitialized]);

  const startVideo = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      videoRef.current.srcObject = stream;
      console.log('Camera access granted');
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Video element not ready');
      return;
    }
    
    if (!isInitialized) {
      setError('Face detection models not loaded yet');
      return;
    }

    setIsCapturing(true);
    setError(null);
    
    try {
      console.log('Starting face detection...');
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5
        }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      console.log('Face detection result:', detections);

      if (detections) {
        const faceData = {
          descriptor: Array.from(detections.descriptor),
          landmarks: detections.landmarks.positions.map(p => ({ x: p.x, y: p.y }))
        };
        setCapturedFace(faceData);
        onFaceCapture(faceData);
        console.log('Face captured successfully');
      } else {
        setError('No face detected. Please ensure your face is clearly visible and well-lit.');
      }
    } catch (error) {
      console.error('Error capturing face:', error);
      setError('An error occurred while capturing your face. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleVerify = async (storedFaceData) => {
    if (!videoRef.current || !canvasRef.current) return;

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      const currentDescriptor = detections.descriptor;
      const storedDescriptor = new Float32Array(storedFaceData.descriptor);
      const distance = faceapi.euclideanDistance(currentDescriptor, storedDescriptor);
      
      // Threshold for face match (lower means stricter matching)
      const threshold = 0.6;
      return distance < threshold;
    }
    return false;
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button 
          className="btn btn-link"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="face-capture-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
        onPlay={() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button
        className="btn btn-primary mt-3"
        onClick={handleCapture}
        disabled={isCapturing || !isInitialized}
        style={{
          backgroundColor: "rgb(76,175,80)",
          borderColor: "rgb(76,175,80)"
        }}
      >
        {!isInitialized ? 'Loading Models...' : 
         isCapturing ? 'Capturing...' : 
         mode === 'capture' ? 'Capture Face' : 'Verify Face'}
      </button>
      {capturedFace && (
        <div className="mt-2 text-success">Face captured successfully!</div>
      )}
    </div>
  );
};

export default FaceCapture; 