
import React from 'react';
import { GradientConfig } from '../types';
import { getGradientCSS } from '../utils/gradientUtils';

interface Props {
  config: GradientConfig;
}

const GradientPreview: React.FC<Props> = ({ config }) => {
  const cssString = getGradientCSS(config);
  
  // Create an object with the styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: config.backgroundColor,
    backgroundImage: config.blobs.map(blob => {
        return `radial-gradient(circle at ${blob.x}% ${blob.y}%, ${blob.color}${Math.round(blob.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent ${blob.size}%)`;
    }).join(', '),
    filter: `blur(${config.blur}px)`,
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    transform: 'scale(1.2)', // Scale up slightly to avoid edge issues with blur
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* The Gradient Canvas */}
      <div style={containerStyle} />
      
      {/* Noise Texture Overlay */}
      {config.noise && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ 
            backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Glassmorphism subtle overlay to give "Premium" feel */}
      <div className="absolute inset-0 pointer-events-none bg-white/10 backdrop-blur-[1px]" />
    </div>
  );
};

export default GradientPreview;
