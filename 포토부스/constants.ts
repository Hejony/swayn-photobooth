import { FrameConfig, FrameType } from './types';

export const FRAME_OPTIONS: FrameConfig[] = [
  {
    id: 'normal-4-grid',
    cuts: 4,
    type: FrameType.NORMAL,
    name: '4컷 그리드 (일반)',
    layout: 'grid',
    frameClasses: 'grid grid-cols-2 gap-2 p-3 bg-white',
    imageContainerClasses: 'aspect-w-3 aspect-h-4',
    imageClasses: 'w-full h-full object-cover rounded-sm',
  },
  {
    id: 'normal-2-vertical',
    cuts: 2,
    type: FrameType.NORMAL,
    name: '2컷 세로 (일반)',
    layout: 'vertical',
    frameClasses: 'flex flex-col gap-2 p-3 bg-white',
    imageContainerClasses: 'aspect-w-4 aspect-h-3',
    imageClasses: 'w-full h-full object-cover rounded-sm',
  },
  {
    id: 'special-4-vertical',
    cuts: 4,
    type: FrameType.SPECIAL,
    name: '4컷 세로 (스페셜)',
    layout: 'vertical',
    frameClasses: 'flex flex-col gap-3 p-4 bg-gradient-to-br from-brand-secondary to-brand-primary',
    imageContainerClasses: 'aspect-w-16 aspect-h-9 border-4 border-white rounded-lg shadow-lg',
    imageClasses: 'w-full h-full object-cover rounded-md',
  },
  {
    id: 'special-1-full',
    cuts: 1,
    type: FrameType.SPECIAL,
    name: '1컷 와이드 (스페셜)',
    layout: 'vertical',
    frameClasses: 'p-4 bg-gray-800',
    imageContainerClasses: 'aspect-w-16 aspect-h-9 border-8 border-brand-secondary rounded-xl shadow-2xl',
    imageClasses: 'w-full h-full object-cover rounded-md',
  },
];

export const COUNTDOWN_SECONDS = 3;
