
import React, { useState } from 'react';
import { GradientConfig } from '../types';
import { getGradientCSS, getFullHTML } from '../utils/gradientUtils';

interface Props {
  config: GradientConfig;
  onClose: () => void;
}

const CodeExporter: React.FC<Props> = ({ config, onClose }) => {
  const [copied, setCopied] = useState<'css' | 'html' | null>(null);

  const css = getGradientCSS(config);
  const html = getFullHTML(config);

  const copyToClipboard = (text: string, type: 'css' | 'html') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">导出你的弥散渐变</h3>
            <p className="text-sm text-slate-500">可在 React、Tailwind 或 原生 HTML/CSS 项目中直接使用。</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* CSS Block */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">CSS 代码</span>
              <button 
                onClick={() => copyToClipboard(css, 'css')}
                className="text-xs font-semibold px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                {copied === 'css' ? <><i className="fa-solid fa-check"></i> 已复制!</> : <><i className="fa-solid fa-copy"></i> 复制 CSS</>}
              </button>
            </div>
            <pre className="bg-slate-50 p-4 rounded-2xl text-xs font-mono text-slate-600 overflow-x-auto border border-slate-100">
              {css}
            </pre>
          </div>

          {/* HTML Block */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">完整 HTML 代码段</span>
              <button 
                onClick={() => copyToClipboard(html, 'html')}
                className="text-xs font-semibold px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                {copied === 'html' ? <><i className="fa-solid fa-check"></i> 已复制!</> : <><i className="fa-solid fa-copy"></i> 复制 HTML</>}
              </button>
            </div>
            <pre className="bg-slate-50 p-4 rounded-2xl text-xs font-mono text-slate-600 overflow-x-auto border border-slate-100 whitespace-pre-wrap">
              {html}
            </pre>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
            <p className="text-[10px] text-slate-400 italic">提示：在容器上使用 scale 属性（如 scale: 1.1）可以有效避免模糊边缘导致的白边问题。</p>
        </div>
      </div>
    </div>
  );
};

export default CodeExporter;
