import { computed, Service, signal } from '@angular/core';
import { Trail, TrailDifficulty } from './types';

@Service()
export class TrailsData {
  private readonly trailList = signal<Trail[]>([
    {
      name: 'Woodpecker Way Loop',
      miles: 1.8,
      difficulty: 'easy',
      favorite: false,
    },
    {
      name: 'Eagle Rock Trail',
      miles: 3.2,
      difficulty: 'moderate',
      favorite: true,
    },
    {
      name: 'Bear Creek Trail',
      miles: 2.5,
      difficulty: 'hard',
      favorite: false,
    },
    {
      name: 'Cedar Ridge Trail',
      miles: 4.1,
      difficulty: 'extreme',
      favorite: false,
    },
    {
      name: 'Pine Valley Trail',
      miles: 5.0,
      difficulty: 'moderate',
      favorite: false,
    },
  ]);
  public readonly difficultyLevel = signal<TrailDifficulty | null>(null);
  public readonly list = computed(() => {
    const trails = this.trailList();
    const sorted = trails.toSorted((left, right) => left.name.localeCompare(right.name));
    if (this.difficultyLevel() !== null) {
      return sorted.filter((t) => t.difficulty === this.difficultyLevel());
    }
    return sorted;
  });
}
