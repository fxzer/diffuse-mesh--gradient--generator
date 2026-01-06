
import React from 'react';
import { GradientConfig, GradientBlob } from '../types';

interface Props {
  config: GradientConfig;
  setConfig: React.Dispatch<React.SetStateAction<GradientConfig>>;
  onRandomize: () => void;
  onAISuggest: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<Props> = ({ config, setConfig, onRandomize, onAISuggest, onReset, isGenerating }) => {
  const updateBlob = (id: string, updates: Partial<GradientBlob>) => {
    setConfig(prev => ({
      ...prev,
      blobs: prev.blobs.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  return (
    <div className="w-80 h-screen bg-white/80 backdrop-blur-md border-r border-slate-200 p-6 overflow-y-auto z-20 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">弥散之美</h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Mesh Generator</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 主要控制 */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">核心控制</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button 
              onClick={onRandomize}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-4 rounded-xl hover:bg-slate-800 transition-all text-sm font-medium active:scale-95"
            >
              <i className="fa-solid fa-dice"></i> 随机布局
            </button>
            <button 
              onClick={onAISuggest}
              disabled={isGenerating}
              className={`flex items-center justify-center gap-2 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium active:scale-95 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className={`fa-solid ${isGenerating ? 'fa-spinner fa-spin' : 'fa-sparkles'}`}></i> AI 灵感
            </button>
          </div>
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 border border-rose-100 text-rose-500 py-2.5 rounded-xl hover:bg-rose-50 transition-all text-sm font-medium active:scale-95"
          >
            <i className="fa-solid fa-arrow-rotate-left"></i> 重置所有参数
          </button>
        </section>

        {/* 全局设置 */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">全局设置</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-slate-600">模糊强度</span>
                <span className="text-slate-400">{config.blur}px</span>
              </div>
              <input 
                type="range" min="10" max="150" 
                value={config.blur} 
                onChange={(e) => setConfig(prev => ({ ...prev, blur: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-700">颗粒纹理</span>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, noise: !prev.noise }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${config.noise ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${config.noise ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div>
              <span className="text-xs font-medium text-slate-600 block mb-2">背景基色</span>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <input 
                    type="color" 
                    value={config.backgroundColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 overflow-hidden cursor-pointer shadow-sm bg-white transition-transform group-hover:scale-105"
                  />
                </div>
                <input 
                  type="text" 
                  value={config.backgroundColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-600 uppercase focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 颜色节点配置 */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">渐变节点 ({config.blobs.length})</h2>
          <div className="space-y-6">
            {config.blobs.map((blob, idx) => (
              <div key={blob.id} className="p-4 rounded-2xl border border-slate-100 bg-white/50 space-y-4 hover:border-slate-200 transition-colors shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">节点 #{idx + 1}</span>
                  {/* Optimized Square Color Picker */}
                  <div className="relative group flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{blob.color}</span>
                    <input 
                      type="color" 
                      value={blob.color}
                      onChange={(e) => updateBlob(blob.id, { color: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-slate-200 p-0.5 overflow-hidden cursor-pointer shadow-sm bg-white transition-all group-hover:scale-110 group-active:scale-95"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">横向位置</label>
                    <input 
                      type="range" min="0" max="100" value={blob.x}
                      onChange={(e) => updateBlob(blob.id, { x: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">纵向位置</label>
                    <input 
                      type="range" min="0" max="100" value={blob.y}
                      onChange={(e) => updateBlob(blob.id, { y: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">扩散大小</label>
                    <input 
                      type="range" min="10" max="120" value={blob.size}
                      onChange={(e) => updateBlob(blob.id, { size: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-400"
                    />
                  </div>
                   <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">不透明度</label>
                    <input 
                      type="range" min="0" max="1" step="0.1" value={blob.opacity}
                      onChange={(e) => updateBlob(blob.id, { opacity: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 text-center text-slate-400 text-[10px] py-4 border-t border-slate-100 tracking-widest uppercase">
        Design with Precision
      </div>
    </div>
  );
};

export default Sidebar;
