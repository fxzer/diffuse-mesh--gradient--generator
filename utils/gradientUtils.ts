
import { GradientBlob, GradientConfig } from "../types";

export const generateRandomBlobs = (colors: string[]): GradientBlob[] => {
  return colors.map((color, index) => ({
    id: `blob-${index}-${Math.random().toString(36).substr(2, 9)}`,
    color,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 40 + Math.random() * 40,
    opacity: 0.5 + Math.random() * 0.4
  }));
};

export const getGradientCSS = (config: GradientConfig): string => {
  const gradients = config.blobs.map(blob => {
    return `radial-gradient(circle at ${blob.x}% ${blob.y}%, ${blob.color}${Math.round(blob.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent ${blob.size}%)`;
  });

  return `background-color: ${config.backgroundColor};\nbackground-image: ${gradients.join(',\n    ')};`;
};

export const getFullHTML = (config: GradientConfig): string => {
  const css = getGradientCSS(config);
  const noiseOverlay = config.noise 
    ? `<div class="noise" style="position: absolute; inset: 0; opacity: 0.05; pointer-events: none; background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>` 
    : '';

  return `
<div class="mesh-gradient" style="position: relative; width: 100%; height: 100vh; overflow: hidden; filter: blur(${config.blur}px); ${css}">
  ${noiseOverlay}
</div>
<style>
  body, html { margin: 0; padding: 0; }
  .mesh-gradient { transform: scale(1.1); /* Prevents white edges from blur */ }
</style>`.trim();
};
