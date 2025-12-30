
import React from 'react';
import { Note, TheoryData } from '../types';
import { PIANO_NOTES, NOTE_COLORS } from '../constants';

interface PianoKeyboardProps {
  activeNotes: Note[];
  rootNote: Note | null;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ activeNotes, rootNote }) => {
  const isBlackKey = (note: Note) => note.includes('#') || note.includes('b');
  
  // Normalize notes for comparison (handling C# vs Db)
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

  const renderOctave = (octaveIndex: number) => {
    return (
      <div key={octaveIndex} className="flex relative h-48">
        {PIANO_NOTES.map((note, i) => {
          const isActive = normalizedActive.includes(note);
          const isRoot = normalizedRoot === note;
          const isBlack = isBlackKey(note);
          
          if (isBlack) {
            // Black keys are absolute positioned over the white keys
            const leftOffset = (i === 1) ? 24 : (i === 3) ? 72 : (i === 6) ? 144 : (i === 8) ? 192 : 240;
            return (
              <div
                key={note}
                className={`absolute h-28 w-8 z-10 border border-slate-900 rounded-b-md transition-all duration-300 ${
                  isActive ? '' : 'bg-slate-900'
                }`}
                style={{ 
                  left: `${leftOffset}px`,
                  backgroundColor: isActive ? NOTE_COLORS[note] : undefined,
                  boxShadow: isActive ? `0 0 15px ${NOTE_COLORS[note]}88` : 'none'
                }}
              >
                <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white opacity-40 uppercase">
                  {note}
                </div>
                {isRoot && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-sm" />}
              </div>
            );
          }
          return (
            <div
              key={note}
              className={`h-48 w-12 border border-slate-300 rounded-b-md flex-shrink-0 transition-all duration-300 relative ${
                isActive ? '' : 'bg-white'
              }`}
              style={{ 
                backgroundColor: isActive ? NOTE_COLORS[note] : undefined,
                boxShadow: isActive ? `inset 0 -10px 20px rgba(0,0,0,0.1), 0 0 15px ${NOTE_COLORS[note]}44` : 'none'
              }}
            >
              <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-400 uppercase font-bold">
                {note}
              </div>
              {isRoot && <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/80 shadow-md border border-black/10" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar p-6 bg-slate-900/50 rounded-xl border border-slate-800">
      <div className="flex justify-center min-w-max">
        {renderOctave(0)}
        {renderOctave(1)}
      </div>
    </div>
  );
};

export default PianoKeyboard;
