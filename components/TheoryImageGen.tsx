
import React, { useState } from 'react';
import { generateMusicImage } from '../services/geminiService';
import { ImageSize, GeneratedImage } from '../types';
import { ImageIcon, Loader2, Download, ExternalLink, Key } from 'lucide-react';

// Fixed: Moved AIStudio into declare global to resolve "identical modifiers" and "subsequent property declaration" errors.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const TheoryImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.K1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setShowKeyPrompt(true);
        return;
      }

      setIsGenerating(true);
      const url = await generateMusicImage(prompt, size);
      
      const newImage: GeneratedImage = {
        url,
        prompt,
        size,
        timestamp: Date.now()
      };

      setImages(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setShowKeyPrompt(true);
      } else {
        alert("图像生成失败。请确保您拥有有效的 API 密钥并连接到互联网。");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeySelect = async () => {
    await window.aistudio.openSelectKey();
    setShowKeyPrompt(false);
  };

  if (showKeyPrompt) {
    return (
      <div className="flex flex-col items-center justify-center h-full glass rounded-2xl p-8 text-center space-y-6">
        <div className="p-4 rounded-full bg-amber-500/20 text-amber-400">
          <Key size={48} />
        </div>
        <h2 className="text-2xl font-bold">需要 API 密钥</h2>
        <p className="text-slate-400 max-w-md">
          高质量图像生成需要从付费 GCP 项目中选择 API 密钥。请确保您已启用结算功能。
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleKeySelect}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
          >
            选择 API 密钥
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 text-sm hover:underline flex items-center justify-center gap-1"
          >
            结算文档 <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
            <ImageIcon size={20} />
          </div>
          <h2 className="font-bold text-slate-200">视觉大师 Pro</h2>
        </div>
        <div className="flex gap-1">
          {Object.values(ImageSize).map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                size === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-900/30">
        {images.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <ImageIcon size={48} strokeWidth={1} />
            <p className="text-sm text-center max-w-[200px]">为您的海报或专辑封面生成惊艳的音乐主题艺术品。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {isGenerating && (
              <div className="aspect-video bg-slate-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-700">
                <Loader2 size={32} className="animate-spin text-indigo-400 mb-3" />
                <p className="text-sm text-indigo-400 font-medium">正在谱写您的杰作...</p>
                <p className="text-xs text-slate-500 mt-1">这可能需要 10-20 秒</p>
              </div>
            )}
            {images.map((img, i) => (
              <div key={i} className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 transition-all hover:border-indigo-500/50">
                <img src={img.url} alt={img.prompt} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-white text-xs font-medium line-clamp-2 mb-2">{img.prompt}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.url;
                        link.download = `harmonia-${Date.now()}.png`;
                        link.click();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-500"
                    >
                      <Download size={14} /> 保存
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="一把星云构成的小提琴..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100 placeholder:text-slate-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : '生成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryImageGen;
