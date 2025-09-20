import React from 'react';
import { FrameConfig } from '../types';
import { FRAME_OPTIONS } from '../constants';
import FrameIcon from './icons/FrameIcon';

interface FrameSelectorProps {
  onFrameSelect: (frame: FrameConfig) => void;
}

const FramePreview: React.FC<{ frame: FrameConfig }> = ({ frame }) => {
  const cuts = Array.from({ length: frame.cuts });
  return (
    <div className={`${frame.frameClasses} w-full h-full shadow-inner rounded-md bg-opacity-50`}>
      {cuts.map((_, index) => (
        <div key={index} className={`${frame.imageContainerClasses} bg-blue-100 rounded-sm flex items-center justify-center`}>
            <FrameIcon className="w-6 h-6 text-brand-secondary" />
        </div>
      ))}
    </div>
  );
};


const FrameSelector: React.FC<FrameSelectorProps> = ({ onFrameSelect }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-2 text-brand-primary">프레임 선택</h2>
      <p className="text-center text-gray-500 mb-8">마음에 드는 프레임을 선택하고 촬영을 시작하세요!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FRAME_OPTIONS.map((frame) => (
          <div
            key={frame.id}
            className="border-2 border-transparent hover:border-brand-primary p-4 rounded-lg cursor-pointer transition-all duration-300 bg-gray-50 hover:shadow-xl"
            onClick={() => onFrameSelect(frame)}
          >
            <div className="h-48 mb-4">
              <FramePreview frame={frame} />
            </div>
            <h3 className="font-semibold text-center text-gray-800">{frame.name}</h3>
            <p className="text-sm text-center text-gray-500">{frame.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameSelector;
