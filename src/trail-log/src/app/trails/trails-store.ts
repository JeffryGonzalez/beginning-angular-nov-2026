import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ApiTrailItem, DifficultyLevel, TrailDifficulty, UserFavorite } from './types';
import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, tap } from 'rxjs';

type TrailsStoreState = {
  difficultyLevel: TrailDifficulty | null;
  inFlightFavorites: string[];
};
export const TrailsStore = signalStore(
  withProps(() => ({
    trailsResource: httpResource<ApiTrailItem[]>(() => '/api/trails'),
    trailsFavorites: httpResource<UserFavorite[]>(() => '/api/user/favorites'),
    difficultyLevels: DifficultyLevel,
  })),
  withState<TrailsStoreState>({
    difficultyLevel: null,
    inFlightFavorites: [],
  }),
  withComputed((state) => ({
    list: computed(() => {
      const trails = state.trailsResource.value() || [];
      const favorites = state.trailsFavorites.value() || [];
      const mappedTrails = trails.map((t) => ({
        ...t,
        favorite: favorites.some((f) => f.id === t.id),
      })); // BS
      if (state.difficultyLevel() !== null) {
        return mappedTrails.filter((t) => t.difficulty === state.difficultyLevel());
      }
      return mappedTrails;
    }),
  })),
  withMethods((store, client = inject(HttpClient)) => ({
    removeFavorite: rxMethod<string>(
      pipe(
        tap((id) => patchState(store, { inFlightFavorites: [id, ...store.inFlightFavorites()] })),
        mergeMap((id) =>
          client.delete(`/api/user/favorites/${id}`).pipe(
            tap(() =>
              patchState(store, {
                inFlightFavorites: store.inFlightFavorites().filter((f) => f !== id),
              }),
            ),
            tap(() => store.trailsFavorites.reload()),
          ),
        ),
      ),
    ),
    addFavorite: rxMethod<string>(
      pipe(
        tap((id) => patchState(store, { inFlightFavorites: [id, ...store.inFlightFavorites()] })),
        mergeMap((id) =>
          client.post<UserFavorite>('/api/user/favorites', { id }).pipe(
            tap((id) =>
              patchState(store, {
                inFlightFavorites: store.inFlightFavorites().filter((f) => f !== id.id),
              }),
            ),
            tap(() => store.trailsFavorites.reload()),
          ),
        ),
      ),
    ),
    setDifficulty: (level: TrailDifficulty) => patchState(store, { difficultyLevel: level }),
    clearDifficulty: () => patchState(store, { difficultyLevel: null }),
  })),
);
