
import React from 'react';
import { Note } from '../types';
import { GUITAR_TUNING, getNoteAtFret, NOTE_COLORS } from '../constants';

interface GuitarFretboardProps {
  activeNotes: Note[];
  rootNote: Note | null;
}

const GuitarFretboard: React.FC<GuitarFretboardProps> = ({ activeNotes, rootNote }) => {
  const frets = Array.from({ length: 16 }, (_, i) => i);
  const strings = [...GUITAR_TUNING].reverse(); // E4 down to E2

  const normalize = (note: string) => {
    if (note === 'Db') return 'C#';
    if (note === 'Eb') return 'D#';
    if (note === 'Gb') return 'F#';
    if (note === 'Ab') return 'G#';
    if (note === 'Bb') return 'A#';
    return note;
  };

  const normalizedActive = activeNotes.map(normalize);
  const normalizedRoot = rootNote ? normalize(rootNote) : null;

  return (
    <div className="w-full overflow-x-auto custom-scrollbar p-6 bg-slate-900/50 rounded-xl border border-slate-800">
      <div className="min-w-[1000px] relative">
        {/* Wood Texture / Background */}
        <div className="absolute inset-0 bg-[#2b1b17] rounded-sm border-y-4 border-slate-800 opacity-90 shadow-2xl" />
        
        {/* Frets */}
        <div className="flex relative z-10">
          {frets.map(f => (
            <div key={f} className="flex-1 h-40 border-r-2 border-[#c5b358]/60 flex items-center justify-center relative">
              {/* Inlays */}
              {[3, 5, 7, 9, 12, 15].includes(f) && (
                <div className={`w-3 h-3 rounded-full bg-slate-300 opacity-40 ${f === 12 ? 'mb-12 shadow-[0_48px_0_0_rgba(203,213,225,0.4)]' : ''}`} />
              )}
              {f === 0 && <div className="absolute inset-y-0 right-0 w-2 bg-white/20 shadow-md" />}
            </div>
          ))}
        </div>

        {/* Strings and Notes */}
        <div className="absolute inset-0 z-20 flex flex-col justify-around py-4">
          {strings.map((stringRoot, sIdx) => (
            <div key={sIdx} className="relative h-1 w-full bg-gradient-to-r from-slate-400 to-slate-200 shadow-sm">
              <div className="absolute inset-0 flex">
                {frets.map(f => {
                  const note = getNoteAtFret(stringRoot, f);
                  const normalizedNote = normalize(note);
                  const isActive = normalizedActive.includes(normalizedNote);
                  const isRoot = normalizedRoot === normalizedNote;

                  if (!isActive) return <div key={f} className="flex-1" />;

                  return (
                    <div key={f} className="flex-1 flex justify-center items-center relative">
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg transition-transform hover:scale-110 cursor-default ${
                          isRoot ? 'ring-2 ring-white ring-offset-2 ring-offset-[#2b1b17]' : ''
                        }`}
                        style={{ backgroundColor: NOTE_COLORS[normalizedNote] }}
                      >
                        {note}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500 text-center">吉他指板：标准调弦 E-A-D-G-B-E</div>
    </div>
  );
};

export default GuitarFretboard;
