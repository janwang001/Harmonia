
import React from 'react';
import { Note } from './types';

export const PIANO_NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_COLORS: Record<Note, string> = {
  'C': '#ef4444', 'C#': '#f97316', 'Db': '#f97316',
  'D': '#eab308', 'D#': '#84cc16', 'Eb': '#84cc16',
  'E': '#22c55e',
  'F': '#10b981', 'F#': '#06b6d4', 'Gb': '#06b6d4',
  'G': '#3b82f6', 'G#': '#6366f1', 'Ab': '#6366f1',
  'A': '#8b5cf6', 'A#': '#d946ef', 'Bb': '#d946ef',
  'B': '#f43f5e'
};

export const GUITAR_TUNING: Note[] = ['E', 'A', 'D', 'G', 'B', 'E']; // E2 to E4 effectively

export const getNoteAtFret = (stringRoot: Note, fret: number): Note => {
  const index = PIANO_NOTES.indexOf(stringRoot === 'Db' ? 'C#' : stringRoot === 'Eb' ? 'D#' : stringRoot === 'Gb' ? 'F#' : stringRoot === 'Ab' ? 'G#' : stringRoot === 'Bb' ? 'A#' : stringRoot);
  const targetIndex = (index + fret) % 12;
  return PIANO_NOTES[targetIndex];
};
