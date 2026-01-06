
export interface GradientBlob {
  id: string;
  color: string;
  x: number; // 0-100
  y: number; // 0-100
  size: number; // 20-100
  opacity: number; // 0-1
}

export interface GradientConfig {
  backgroundColor: string;
  blobs: GradientBlob[];
  noise: boolean;
  blur: number; // 10-100
}

export interface ColorTheme {
  name: string;
  colors: string[];
  background: string;
}
