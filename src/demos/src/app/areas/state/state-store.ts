import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

type ByVals = 1 | 3 | 5;
type StateStoreState = {
  by: ByVals;
  current: number;
};

export const StateStore = signalStore(
  withState<StateStoreState>({
    by: 1,
    current: 0,
  }),
  withMethods((state) => ({
    setBy: (by: ByVals) => patchState(state, { by }),
    increment: () => patchState(state, { current: state.current() + state.by() }),
    decrement: () => patchState(state, { current: state.current() - state.by() }),
  })),
  withComputed((state) => ({
    fizzBuzz: computed(() => {
      const current = state.current();
      if (current === 0) {
        return 'Zero';
      }
      if (current % 3 === 0 && current % 5 === 0) {
        return 'FizzBuzz';
      }
      if (current % 3 === 0) {
        return 'Fizz';
      }
      if (current % 5 === 0) {
        return 'Buzz';
      }
      return '';
    }),
  })),
  withHooks({
    onInit(store) {
      // this will run when this is created
      console.log('The Store is Created');
      // check local storage for saved state, if it is there, read it, patch the state.
      const savedState = localStorage.getItem('counter-data');
      if (savedState !== null) {
        const savedStateAsObject = JSON.parse(savedState);
        patchState(store, savedStateAsObject);
      }

      watchState(store, (state) => {
        localStorage.setItem('counter-data', JSON.stringify(state));
      });
      // oh, and any time they change the state save it.
    },
    onDestroy(store) {
      // this will run when this is destroyed (taken out of memory)
      console.log('The Store is Destroyed');
    },
  }),
);
