
export enum AppState {
  SELECTING_FRAME = 'SELECTING_FRAME',
  CAPTURING = 'CAPTURING',
  PREVIEW = 'PREVIEW',
}

export enum FrameType {
  NORMAL = '일반 프레임',
  SPECIAL = '스페셜 프레임',
}

export interface FrameConfig {
  id: string;
  cuts: 1 | 2 | 4;
  type: FrameType;
  name: string;
  layout: 'vertical' | 'grid';
  frameClasses: string;
  imageContainerClasses: string;
  imageClasses: string;
}
