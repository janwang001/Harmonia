
import React, { useState } from 'react';
import { TheoryData, Note } from './types';
import { parseTheoryRequest } from './services/geminiService';
import PianoKeyboard from './components/PianoKeyboard';
import GuitarFretboard from './components/GuitarFretboard';
import TheoryChat from './components/TheoryChat';
import TheoryImageGen from './components/TheoryImageGen';
import { Search, Music2, Layers, LayoutGrid, Info } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [theoryData, setTheoryData] = useState<TheoryData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'piano' | 'guitar'>('piano');

  const handleSearch = async () => {
    if (!query.trim() || isParsing) return;
    setIsParsing(true);
    try {
      const data = await parseTheoryRequest(query);
      setTheoryData(data);
    } catch (error) {
      console.error(error);
      alert("分析该乐理概念失败。尝试搜索如 'C 大七和弦' 或 'D Dorian 音阶'。");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Music2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Harmonia</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">AI 乐理实验室</p>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-8">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="例如：G Mixolydian, Bb 小九和弦, 三全音音程..."
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 text-sm"
            />
            <button 
              onClick={handleSearch}
              disabled={isParsing || !query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isParsing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Side: Visualizations */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          {theoryData ? (
            <>
              {/* Concept Info Card */}
              <div className="glass p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{theoryData.name}</h2>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        {theoryData.type === 'scale' ? '音阶' : theoryData.type === 'chord' ? '和弦' : theoryData.type === 'interval' ? '音程' : '自定义'}
                      </span>
                      {theoryData.formula && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-xs font-mono">
                          {theoryData.formula}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
                    <button 
                      onClick={() => setActiveTab('piano')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'piano' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <LayoutGrid size={16} /> 钢琴
                    </button>
                    <button 
                      onClick={() => setActiveTab('guitar')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'guitar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <Layers size={16} /> 吉他
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {theoryData.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {theoryData.notes.map((note, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">{theoryData.intervals[i]}</span>
                      <span className="text-xl font-bold text-white">{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualization Container */}
              <div className="flex-1 min-h-[400px]">
                {activeTab === 'piano' ? (
                  <PianoKeyboard activeNotes={theoryData.notes} rootNote={theoryData.root} />
                ) : (
                  <GuitarFretboard activeNotes={theoryData.notes} rootNote={theoryData.root} />
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-2xl border-2 border-dashed border-slate-700">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-indigo-400">
                <Search size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">准备好可视化了吗？</h2>
              <p className="text-slate-400 max-w-sm">
                在上方搜索框输入任何音阶、和弦或音程，即可查看它们在钢琴和指板上的分布。
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {[
                  { label: 'C 大调音阶', query: 'C Major Scale' },
                  { label: 'A 小七和弦', query: 'A Minor 7' },
                  { label: 'F# Lydian 音阶', query: 'F# Lydian' },
                  { label: '纯五度音程', query: 'Perfect 5th' }
                ].map(example => (
                  <button 
                    key={example.query}
                    onClick={() => {
                      setQuery(example.label);
                      // 内部触发搜索
                      setTimeout(() => handleSearch(), 100);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full border border-slate-700 transition-colors"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tools */}
        <div className="w-[400px] flex flex-col gap-6">
          <div className="flex-1">
            <TheoryChat />
          </div>
          <div className="h-[40%]">
            <TheoryImageGen />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
