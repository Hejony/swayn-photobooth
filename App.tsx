import React, { useState, useEffect } from 'react';
import { AppState, FrameConfig } from './types';
import Header from './components/Header';
import FrameSelector from './components/FrameSelector';
import CameraView from './components/CameraView';
import PhotoPreview from './components/PhotoPreview';
import { FRAME_OPTIONS } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTING_FRAME);
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig>(FRAME_OPTIONS[0]);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#preview&frame=')) {
        const params = new URLSearchParams(hash.substring(hash.indexOf('&') + 1));
        const frameId = params.get('frame');
        const compressedPhotos = params.get('photos');

        if (frameId && compressedPhotos && (window as any).lzString) {
          const frame = FRAME_OPTIONS.find(f => f.id === frameId);
          const decompressed = (window as any).lzString.decompressFromEncodedURIComponent(compressedPhotos);
          const photos = decompressed.split('|').map((data: string) => `data:image/jpeg;base64,${data}`);
          
          if (frame && photos.length > 0) {
            setSelectedFrame(frame);
            setCapturedPhotos(photos);
            setAppState(AppState.PREVIEW);
            setIsSharedView(true);
            // Clean up URL to avoid re-triggering on refresh
            window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse share URL", error);
      // Clean up URL in case of error
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } finally {
        setIsInitialized(true);
    }
  }, []);

  const handleFrameSelect = (frame: FrameConfig) => {
    setSelectedFrame(frame);
    setAppState(AppState.CAPTURING);
  };

  const handleCaptureComplete = (photos: string[]) => {
    setCapturedPhotos(photos);
    setAppState(AppState.PREVIEW);
  };

  const handleRetry = () => {
    setCapturedPhotos([]);
    setAppState(AppState.SELECTING_FRAME);
    setIsSharedView(false);
  };
  
  const renderContent = () => {
    if (!isInitialized) {
        return <div className="text-center text-brand-primary">Loading...</div>;
    }
    switch (appState) {
      case AppState.SELECTING_FRAME:
        return <FrameSelector onFrameSelect={handleFrameSelect} />;
      case AppState.CAPTURING:
        return <CameraView frameConfig={selectedFrame} onCaptureComplete={handleCaptureComplete} />;
      case AppState.PREVIEW:
        return <PhotoPreview frameConfig={selectedFrame} photos={capturedPhotos} onRetry={handleRetry} isSharedView={isSharedView} />;
      default:
        return <FrameSelector onFrameSelect={handleFrameSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-brand-secondary">
        <p>&copy; 2024 Swayn. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
