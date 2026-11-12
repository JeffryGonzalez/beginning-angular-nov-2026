import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, tap } from 'rxjs';
import { ApiTrailItem, DifficultyLevel, TrailDifficulty, UserFavorite } from './types';

type TrailsStoreState = {
  difficultyLevel: TrailDifficulty | null;
  inFlightFavorites: string[];
  addedFavs: string[];
  removedFavs: string[];
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
    addedFavs: [],
    removedFavs: [],
  }),
  withComputed((state) => ({
    list: computed(() => {
      const trails = state.trailsResource.value() || [];
      const favorites = state.trailsFavorites.value() || [];
      const addedFavs = state.addedFavs();
      const removedFavs = state.removedFavs();
      const mappedTrails = trails.map((t) => ({
        ...t,
        favorite:
          favorites.some((f) => f.id === t.id) ||
          (addedFavs.some((f) => f === t.id) && !removedFavs.some((f) => f === t.id)),
      }));
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
            //tap(() => store.trailsFavorites.reload()),
            tap(() => patchState(store, { removedFavs: [id, ...store.removedFavs()] })),
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
            // tap(() => store.trailsFavorites.reload()),
            tap(() => patchState(store, { addedFavs: [id, ...store.addedFavs()] })),
          ),
        ),
      ),
    ),
    setDifficulty: (level: TrailDifficulty) => patchState(store, { difficultyLevel: level }),
    clearDifficulty: () => patchState(store, { difficultyLevel: null }),
  })),
);
