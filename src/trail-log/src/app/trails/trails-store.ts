import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ApiTrailItem, DifficultyLevel, TrailDifficulty } from './types';
import { httpResource } from '@angular/common/http';
import { computed } from '@angular/core';

type TrailsStoreState = {
  difficultyLevel: TrailDifficulty | null;
};
export const TrailsStore = signalStore(
  withProps(() => ({
    trailsResource: httpResource<ApiTrailItem[]>(() => '/api/trails'),
    difficultyLevels: DifficultyLevel,
  })),
  withState<TrailsStoreState>({
    difficultyLevel: null,
  }),
  withComputed((state) => ({
    list: computed(() => {
      const trails = state.trailsResource.value() || [];
      const mappedTrails = trails.map((t) => ({ ...t, favorite: false })); // BS
      if (state.difficultyLevel() !== null) {
        return mappedTrails.filter((t) => t.difficulty === state.difficultyLevel());
      }
      return mappedTrails;
    }),
  })),
  withMethods((store) => ({
    setDifficulty: (level: TrailDifficulty) => patchState(store, { difficultyLevel: level }),
    clearDifficulty: () => patchState(store, { difficultyLevel: null }),
  })),
);
