
export type Note = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B';

export type TheoryType = 'scale' | 'chord' | 'interval' | 'custom';

export interface TheoryData {
  name: string;
  type: TheoryType;
  root: Note;
  notes: Note[];
  intervals: string[];
  description: string;
  formula?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
  size: string;
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}
