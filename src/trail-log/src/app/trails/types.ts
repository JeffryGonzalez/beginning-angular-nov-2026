export const DifficultyLevel = ['easy', 'moderate', 'hard', 'extreme'] as const;
export type TrailDifficulty = (typeof DifficultyLevel)[number];

export interface Trail {
  id: string;
  name: string;
  miles: number;
  difficulty: TrailDifficulty;
  favorite: boolean;
}

export type ApiTrailItem = Omit<Trail, 'favorite'>;
