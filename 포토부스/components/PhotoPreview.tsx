import React, { useRef, useState, useEffect } from 'react';
import { FrameConfig } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import RetryIcon from './icons/RetryIcon';
import QRCode from './QRCode';

interface PhotoPreviewProps {
  frameConfig: FrameConfig;
  photos: string[];
  onRetry: () => void;
  isSharedView?: boolean;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ frameConfig, photos, onRetry, isSharedView = false }) => {
  const photoStripRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isSharedView && photos.length > 0 && (window as any).lzString) {
      const photoData = photos.map(p => p.split(',')[1]);
      const joinedData = photoData.join('|');
      const compressed = (window as any).lzString.compressToEncodedURIComponent(joinedData);
      const url = `${window.location.origin}${window.location.pathname}#preview&frame=${frameConfig.id}&photos=${compressed}`;
      setShareUrl(url);
    }
  }, [isSharedView, photos, frameConfig.id]);
  
  const generateCanvasImage = async (): Promise<string | null> => {
      const element = photoStripRef.current;
      if (!element) return null;
      
      const originalShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';

      try {
          const { default: html2canvas } = await import('https://cdn.skypack.dev/html2canvas');
          const canvas = await html2canvas(element, {
              scale: 2,
              backgroundColor: null,
              useCORS: true,
          });
          return canvas.toDataURL('image/png');
      } catch (error) {
          console.error("Failed to generate canvas: ", error);
          return null;
      } finally {
          element.style.boxShadow = originalShadow;
      }
  };

  const downloadImage = async () => {
    const imageDataUrl = await generateCanvasImage();
    if (imageDataUrl) {
      const link = document.createElement('a');
      link.download = `swayn-photobooth-${new Date().getTime()}.png`;
      link.href = imageDataUrl;
      link.click();
    } else {
      alert("사진을 다운로드하는 데 실패했습니다.");
    }
  };

  // Shared view (mobile after scanning QR)
  if (isSharedView) {
    return (
      <div className="w-full flex flex-col items-center animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-700">사진을 저장하세요!</h2>
        <p className="text-center text-gray-500 mb-8">아래 버튼을 눌러 기기에 사진을 다운로드하세요.</p>
        
        <div ref={photoStripRef} className={`${frameConfig.frameClasses} rounded-lg shadow-xl w-full max-w-sm`}>
          {photos.map((photo, index) => (
            <div key={index} className={frameConfig.imageContainerClasses}>
              <img src={photo} alt={`Captured ${index + 1}`} className={`${frameConfig.imageClasses} transform scale-x-[-1]`} />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button onClick={downloadImage} className="flex items-center px-8 py-4 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-secondary">
            <DownloadIcon className="w-6 h-6 mr-3" />
            다운로드
          </button>
        </div>
      </div>
    );
  }

  // Desktop view (after taking photos)
  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-700">완성!</h2>
      <p className="text-center text-gray-500 mb-8">QR 코드를 스캔하여 사진을 저장하세요.</p>
      
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-4">
        {/* Photo strip */}
        <div ref={photoStripRef} className={`${frameConfig.frameClasses} rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm`}>
          {photos.map((photo, index) => (
            <div key={index} className={frameConfig.imageContainerClasses}>
              <img src={photo} alt={`Captured ${index + 1}`} className={`${frameConfig.imageClasses} transform scale-x-[-1]`} />
            </div>
          ))}
        </div>

        {/* Right column for QR */}
        <div className="flex flex-col gap-6 w-full md:w-auto max-w-sm">
            {/* QR Code section */}
            <div className="text-center p-6 bg-white/70 rounded-2xl shadow-md flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">모바일로 저장</h3>
                <p className="text-gray-600 mb-4 text-sm">스마트폰으로 스캔하세요.</p>
                {shareUrl ? (
                    <div className="p-3 bg-white rounded-lg inline-block ring-4 ring-brand-secondary/50">
                        <QRCode value={shareUrl} size={180} />
                    </div>
                ) : (
                    <div className="w-[204px] h-[204px] bg-gray-100 flex items-center justify-center rounded-lg text-gray-500">
                        <p>QR 코드 생성중...</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <button onClick={onRetry} className="flex items-center px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
          <RetryIcon className="w-5 h-5 mr-2" />
          다시 찍기
        </button>
        <button onClick={downloadImage} className="flex items-center px-8 py-3 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-secondary">
          <DownloadIcon className="w-5 h-5 mr-2" />
          다운로드
        </button>
      </div>
    </div>
  );
};

export default PhotoPreview;