export type VolumeSettings = {
  sensitivity: number;
  brightness: number;
  bgBrightness: number;
  smoothing: number;
  bgColor: string;
};

export type RainbowSettigns = {
  sensitivity: number;
  brightness: number;
  bgBrightness: number;
  smoothing: number;
  bgColor: string;
};

export type FlashSettings = {
  sensitivity: number;
  brightness: number;
  smoothing: number;
  color: string;
};

export type Settings = {
  mode: number;
  vuGreenRed: VolumeSettings;
  vuRainbow: RainbowSettigns;
  flash: FlashSettings;
};

export interface ModeSettings {
  sensitivity: number;
  brightness: number;
  bgBrightness?: number;
  smoothing: number;
  color?: string;
  bgColor?: string;
}
