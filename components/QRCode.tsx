import React, { useRef, useEffect } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 256 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && (window as any).QRCode) {
      (window as any).QRCode.toCanvas(
        canvasRef.current,
        value,
        { width: size, margin: 1 },
        (error: any) => {
          if (error) console.error('QRCode generation error:', error);
        }
      );
    }
  }, [value, size]);

  return <canvas ref={canvasRef} style={{ width: `${size}px`, height: `${size}px` }} />;
};

export default QRCode;
