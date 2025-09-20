import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FrameConfig } from '../types';
import { COUNTDOWN_SECONDS } from '../constants';

interface CameraViewProps {
  frameConfig: FrameConfig;
  onCaptureComplete: (photos: string[]) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ frameConfig, onCaptureComplete }) => {
  const [photoCount, setPhotoCount] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photosRef = useRef<string[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      if (err instanceof Error && err.name === 'NotFoundError') {
        setCameraError("카메라를 찾을 수 없습니다. 기기에 카메라가 연결되어 있는지 확인해주세요.");
      } else {
        setCameraError("카메라에 접근할 수 없습니다. 브라우저에서 카메라 권한을 허용했는지 확인해주세요.");
      }
    }
  }, []);
  
  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        photosRef.current.push(dataUrl);
        setPhotoCount(prev => prev + 1);
      }
    }
  }, []);

  const startCaptureProcess = useCallback(() => {
    if (isCapturing || photoCount >= frameConfig.cuts) return;

    setIsCapturing(true);
    let currentCountdown = COUNTDOWN_SECONDS;
    setCountdown(currentCountdown);

    const countdownInterval = setInterval(() => {
      currentCountdown -= 1;
      setCountdown(currentCountdown);
      if (currentCountdown <= 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        capturePhoto();
        setIsCapturing(false);
      }
    }, 1000);
  }, [isCapturing, photoCount, frameConfig.cuts, capturePhoto]);

  useEffect(() => {
    startCamera();
    return () => {
        stopCamera();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (photoCount > 0 && photoCount < frameConfig.cuts) {
      setTimeout(() => startCaptureProcess(), 1000); // Pause before next countdown
    } else if (photoCount === frameConfig.cuts) {
      stopCamera();
      onCaptureComplete(photosRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoCount, frameConfig.cuts, onCaptureComplete]);


  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-2xl aspect-w-4 aspect-h-3 bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
        {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white p-4">
                <p className="text-center font-semibold">{cameraError}</p>
            </div>
        )}
        {countdown !== null && countdown > 0 && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-9xl font-bold text-white animate-ping">{countdown}</div>
          </div>
        )}
        {countdown === 0 && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="text-8xl font-bold text-brand-primary animate-pulse">찰칵!</div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="mt-6 text-center">
         <p className="text-xl text-gray-600 mb-4">{photoCount} / {frameConfig.cuts} 장 촬영됨</p>
        {!isCapturing && photoCount < frameConfig.cuts && (
           <button 
             onClick={startCaptureProcess} 
             disabled={!!cameraError}
             className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
           >
            {photoCount === 0 ? '촬영 시작' : '다음 사진 찍기'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraView;