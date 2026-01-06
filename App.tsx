
import React, { useState, useCallback } from 'react';
import { GradientConfig } from './types';
import { generateRandomBlobs } from './utils/gradientUtils';
import { generateAIPalette } from './services/geminiService';
import Sidebar from './components/Sidebar';
import GradientPreview from './components/GradientPreview';
import CodeExporter from './components/CodeExporter';

const INITIAL_COLORS = ["#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#EDE7F6"];
const DEFAULT_CONFIG: GradientConfig = {
  backgroundColor: '#FFFFFF',
  blobs: generateRandomBlobs(INITIAL_COLORS),
  noise: true,
  blur: 60
};

const App: React.FC = () => {
  const [config, setConfig] = useState<GradientConfig>(DEFAULT_CONFIG);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMood, setAiMood] = useState('北欧落日');

  const handleRandomize = useCallback(() => {
    const colors = config.blobs.map(b => b.color);
    setConfig(prev => ({
      ...prev,
      blobs: generateRandomBlobs(colors)
    }));
  }, [config.blobs]);

  const handleReset = useCallback(() => {
    if (confirm('确定要重置所有设置吗？当前所有自定义修改都将丢失。')) {
      setConfig({
        backgroundColor: '#FFFFFF',
        blobs: generateRandomBlobs(INITIAL_COLORS),
        noise: true,
        blur: 60
      });
      setAiMood('北欧落日');
    }
  }, []);

  const handleAISuggest = async () => {
    setIsGenerating(true);
    const moods = [
      '北欧落日', '赛博霓虹', '清晨薄雾', '幽静森林', 
      '棉花糖', '深海秘境', '黄金时刻', '薰衣草田',
      '极简主义', '奢华玫瑰金', '冰冻湖面', '沙漠之影'
    ];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    try {
      const theme = await generateAIPalette(randomMood);
      setAiMood(theme.name);
      setConfig(prev => ({
        ...prev,
        backgroundColor: theme.background,
        blobs: generateRandomBlobs(theme.colors)
      }));
    } catch (e) {
      console.error(e);
      setAiMood(randomMood);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 select-none overflow-hidden">
      {/* 侧边控制面板 */}
      <Sidebar 
        config={config} 
        setConfig={setConfig} 
        onRandomize={handleRandomize}
        onAISuggest={handleAISuggest}
        onReset={handleReset}
        isGenerating={isGenerating}
      />

      {/* 主预览区 */}
      <main className="flex-1 relative flex flex-col">
        {/* 顶部状态栏 */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 pointer-events-none">
          <div className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl pointer-events-auto">
             <p className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
               当前氛围: <span className="text-indigo-600 font-black">{aiMood}</span>
             </p>
          </div>

          <div className="flex gap-4 pointer-events-auto">
             <button 
              onClick={() => setIsExporterOpen(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-2xl shadow-indigo-400/50 hover:bg-indigo-700 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
             >
               <i className="fa-solid fa-code"></i> 获取代码
             </button>
          </div>
        </div>

        {/* 预览画布容器 */}
        <div className="flex-1 p-8">
          <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white transition-transform duration-700">
            <GradientPreview config={config} />
          </div>
        </div>

        {/* 底部装饰信息 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
           <div className="bg-slate-900/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
             Interactive Diffuse Engine • 实时交互弥散引擎
           </div>
        </div>
      </main>

      {/* 导出代码弹窗 */}
      {isExporterOpen && (
        <CodeExporter config={config} onClose={() => setIsExporterOpen(false)} />
      )}
    </div>
  );
};

export default App;
