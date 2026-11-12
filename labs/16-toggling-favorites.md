# Toggling Favorites

In this lab we will regain our ability to toggle a trail as a favorite or not.

We will start by getting the list of favorite trails for the user, and having the UI accurately display the state of the trail with the user's decision about it being a favorite or not.

Then we will do an HTTP `POST` every time a user adds a favorite, and a `DELETE` when they remove it.


## Fix the User Favorite Endpoints in Mockoon

Open the Mockoon API mocking tool in your VM. 

Add `/api` in front of user favorites path on the list of paths. The new path should be `/api/user/favorites`

Start the Mockoon server by clicking the green "play" arrow in the toolbar.

## Create a data type

In `/src/app/trails/types.ts` create a data type for a user favorite. This will be pretty simple, just an object with an ID property, and the ID will be the ID of the trail.

```ts
export type UserFavorite = {
  id: string;
};

```

## Add a new property to the store

> *Note*: At the end of the lab, the entire completed store will be provided for you. Try to fit the code in each step on your own, making sure to bring in the missing imports, etc. If you need to, you can skip to the last step ("Solution") and copy the entire store, or just look as a reference.

In the store's `withProps` function (in `trails-store.ts`), add a new `HttpResource` for the favorites:

```ts
trailsResource: httpResource<UserFavorite[]>(() => '/api/user/favorites'),
```

## Update the computed list

Still in the store, we will update our existing `withComputed` "list" property to get all of the favorites, and then in the map that creates mappedTrails to set favorite property property based on the presence or absence of the favorite for this user.


```diff
    list: computed(() => {
      const trails = state.trailsResource.value() || [];
+      const favorites = state.trailsFavorites.value() || [];
      const mappedTrails = trails.map((t) => ({
        ...t,
+        favorite: favorites.some((f) => f.id === t.id),
      })); // BS
      if (state.difficultyLevel() !== null) {
        return mappedTrails.filter((t) => t.difficulty === state.difficultyLevel());
      }
      return mappedTrails;
    }),
```

At this point when you look at the web page in the browser, you should have one trail that is a favorite. (Bear Creek Trail)

## Progressive loading of data

We will add a bit of a dramatic delay temporarily for the favorites API endpoint. Back in Mockoon, select the route for `/api/user/favorites` and in the delay input (the one with a little clock next to it), add a delay of 5000 (about five seconds).

Reload and observe the web page. We are telling a bit of a fib - until the favorites are loaded, we can't actually tell the user if a particular trail is a favorite or not.

We have two choices. One is better than the other. 

First choice: Hide *everything* until both the *trail list* and the *favorites* are loaded. 

Second choice: Hide just the favorite (and indicate they are being loaded) if the trails load first.

Obviously (I think) we can't show the favorites until we have the trails, but we've already covered that by hiding the entire UI (trails-list) while the trails are loading. But if the favorites come in *later*, there is no reason not to show the user *something* while their favorites load.

We will do this work in the `trail-card.ts` component. I'll give you a couple of hints, and see if you can figure out what to do.

- Inject the `TrailsStore` into the card.
- You can check the `isLoading()` status of the store's `trailsFavorites` resource and alter what is displayed in the template.

<details>

<summary>Some code to look at</summary>

In the `trail-card.ts` class body, inject the store:

```ts
private readonly store = inject(TrailsStore);
```

In the template portion, for the div near the end with the class of `card-actions`, change it to look like the following:

```html
 <div class="card-actions justify-end">
        @if (store.trailsFavorites.isLoading()) {
          <span class="loading loading-ring loading-xl"></span>
        } @else {
          <label
            class="label"
            [class.text-success]="trail().favorite"
            [class.text-accent]="!trail().favorite"
          >
            {{ trail().favorite ? 'Favorite!' : 'Mark as Favorite' }}
            <input
              type="checkbox"
              [checked]="trail().favorite"
              (change)="toggleFavorite()"
              class="toggle toggle-sm"
            />
          </label>
       }
</div>
```


</details>

Try loading the page again, and notice the loading status on each card while the favorites load.

Nice job.

Now remove the delay for the favorites in Mockooon by setting it back to 0.

## Adding methods to the store to allow for toggling of the favorites

We will call these methods from the template in the next step. Will will first update the store to provide a way for the user component to either add a trail as a favorite or remove a trail from the user's list of favorites.

Since there might be a bit of a delay on the `POST` and `DELETE` operations (and you can play with that by adding the delay back in in the Mockoon interface), we will keep a list in the store of all the ids of trails that have "in process" or "in flight" changes pending to their favorite status.

In the `trails-store.ts` file, add a new property to the `TrailsStoreState` called `inFlightFavorites`:


```ts
type TrailsStoreState = {
  difficultyLevel: TrailDifficulty | null;
  inFlightFavorites: string[];
};
```

In the store's call to `withState`, initialize that property to an empty array:

```ts
  withState<TrailsStoreState>({
    difficultyLevel: null,
    inFlightFavorites: [],
  }),
```

## Implementing `addFavorite` with RXJS

We will use Angular's "built in" HTTP client here. This is actually what the `httpResource` properties are using "behind the scenes". The HttpClient in Angular is a bit of a weirdo. On one hand it is *awesome*, because it allows developers to add configuration for things called "interceptors" that give you a single place to add things like some code to add authorization headers, etc. (We'll cover that in a later course). It's a little challenging at first, though, because it uses the "Reactive Extensions for JavaScript (RXJS)", which is based on the metaphors of *subjects* and *observers*. It's very powerful, and a great way to deal with asynchronous operations like HTTP, Server Sent Events, and WebSockets. A lot of times, though, it is overkill. We are going to use the RXJS stuff here because you will see this kind of thing a *lot* in applications and you should be able to recognize what is going on.


We'll update our call to `withMethods` in the store to ask for the client to be injected. Angular will automatically provide this for us when the store is created.

```ts
  withMethods((store, client = inject(HttpClient)) => ({ /* leaving out the rest, but leave it in your code */
```

In the `withMethods` call, we will add another method (we already have `setDifficulty` and `clearDifficulty`, so add this one either before or after those, dealer's choice). Here's the method to add. You will have to do some `Ctrl+.` to get the imports for the various RXJS operators.

> Note: if `rxMethod` doesn't automatically import for you, add  `import { rxMethod } from '@ngrx/signals/rxjs-interop';` at the top. We haven't used anything from the package yet, and sometimes VS Code doesn't have it indexed yet.

Here is the method. It's a mouthful. I'll try to explain it below:

```ts
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
```

So this method `addFavorite` is an `rxMethod` (rx, again, for reactive extensions, the observable subjects thing). This method will be asynchronous and take a string as an argument (that's the generic parameter on `rxMethod<string>`) and that will be the id of the trail to add as a favorite.

RXJS works with *observable streams* of things that happen over time. You use `pipe`s to *transform* the stram of things that are happening. So the first call to `pipe` means "when this method is invoked - and it might be invoked multiple times simultaneously - push the request through this pipe".

The first rxjs operator (there are about 134 of them - we use about 4-6 regularly) is `tap` - I think of this as *take a peek* - in other words, I want to look at the observable thing flowing through the pipe, but I'm not going to do anything to it, by maybe use it to change something outside (that's called a "side effect" by the way). So here, we are taking the id of the trail, and patching the state so that the `inFlightFavorites` contains this new id, along with any that might already be there. 

The next thing is using `mergeMap` to take that id and make the actual http POST request. This is the *really* asynchronous part - an API request is going to take a bit of time - and even under the best of circumstances it will be longer than 16.667 milliseconds - so we start it in the background. When that completes *some unknown time in the future*, it's result will be observable, so we are using another `pipe` on that response, and a `tap` to remove the id from the list of inflight ids. 

> *Note*: Two things. `mergeMap` means something like 'there may be several of these happening at the same time (user's might make several of the trails a favorite) and they are going to finish at different times. Just merge them all together, the order of the responses don't matter. When the order *does* matter, you might use `concatMap`. There is another operator, `switchMap` that will only allow one request at a time - it will cancel the previous one when the new one is made. Probably not what we'd want here. The other thing is we are not doing any error handling. That is *bad*, but can we just be a bit optimistic for the *first class* in the series? I promise, come back for later classes, and we'll get a lot less optimistic. (but hint, the operator `catchError` is helpful for that).

Notice also at the end of the pipe, in yet another `tap`, we are reloading the trails. This is a reasonable default - fetch as often as you can. There are other techniques you could use, and we have other classes for that.

### Implement the `removeFavorite` store method

This one is nearly identitcal to `addFavorite`. We add the id to the list of inFlight changes, we do the deed (the `DELETE`), and then remove it from the list of inflight changes, and reload the data.

```ts
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
```

## Update the Trail Card

On `trail-card.ts` fix the `toggleFavorit()` method with the following:

```ts
  protected toggleFavorite() {
    if (this.trail().favorite) {
      this.store.removeFavorite(this.trail().id);
    } else {
      this.store.addFavorite(this.trail().id);
    }
  }
```

Pretty clear? If the trail this card is displaying is a favorite, then remove it, otherwise add it.

One thing we'd want to be careful of (because we are using mergeMap) is a user toggling a favorite back and forth before the response is back. So, we'll create a `computed` property on the component, and use it in the template:

```ts
  private readonly inFlight = computed(() => {
    const all = this.store.inFlightFavorites();
    return all.some((a) => a === this.trail().id);
  });
```

Pretty clear? This is how we can see if *this* trail the card is holding has in-flight changes (either being added or removed from favorites).

Let's add a call to this in the template along with our predicate for hiding the favorite status if the favorites are loading.

```html
   <div class="card-actions justify-end">
        @if (store.trailsFavorites.isLoading() || inFlight()) { 
          ...
```

You should now be able to toggle favorites!

Ponder this. Look at the code. Really think through it. This has a lot going on. Try to come up with questions if you can! Ask your AI Copilot for deeper explanations if you need to!

## Solution


### `types.ts`

```diff
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

+export type UserFavorite = {
+  id: string;
+};
```

### `trails-store.ts`

```diff
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
+import { ApiTrailItem, DifficultyLevel, TrailDifficulty, UserFavorite } from './types';
+import { HttpClient, httpResource } from '@angular/common/http';
+import { computed, inject } from '@angular/core';
+import { rxMethod } from '@ngrx/signals/rxjs-interop';
+import { mergeMap, pipe, tap } from 'rxjs';

type TrailsStoreState = {
  difficultyLevel: TrailDifficulty | null;
+  inFlightFavorites: string[];
};
export const TrailsStore = signalStore(
  withProps(() => ({
    trailsResource: httpResource<ApiTrailItem[]>(() => '/api/trails'),
+    trailsFavorites: httpResource<UserFavorite[]>(() => '/api/user/favorites'),
    difficultyLevels: DifficultyLevel,
  })),
  withState<TrailsStoreState>({
    difficultyLevel: null,
+    inFlightFavorites: [],
  }),
  withComputed((state) => ({
    list: computed(() => {
      const trails = state.trailsResource.value() || [];
      const favorites = state.trailsFavorites.value() || [];
      const mappedTrails = trails.map((t) => ({
        ...t,
+        favorite: favorites.some((f) => f.id === t.id),
      })); // BS
      if (state.difficultyLevel() !== null) {
        return mappedTrails.filter((t) => t.difficulty === state.difficultyLevel());
      }
      return mappedTrails;
    }),
  })),
  withMethods((store, client = inject(HttpClient)) => ({
+    removeFavorite: rxMethod<string>(
+      pipe(
+        tap((id) => patchState(store, { inFlightFavorites: [id, ...store.inFlightFavorites()] })),
+       mergeMap((id) =>
+          client.delete(`/api/user/favorites/${id}`).pipe(
+            tap(() =>
+              patchState(store, {
+                inFlightFavorites: store.inFlightFavorites().filter((f) => f !== id),
+              }),
+           ),
+            tap(() => store.trailsFavorites.reload()),
+          ),
+        ),
+      ),
+    ),
+    addFavorite: rxMethod<string>(
+      pipe(
+       tap((id) => patchState(store, { inFlightFavorites: [id, ...store.inFlightFavorites()] })),
+        mergeMap((id) =>
+          client.post<UserFavorite>('/api/user/favorites', { id }).pipe(
+            tap((id) =>
+              patchState(store, {
+                inFlightFavorites: store.inFlightFavorites().filter((f) => f !== id.id),
+             }),
+           ),
+            tap(() => store.trailsFavorites.reload()),
+         ),
+        ),
+      ),
+   ),
    setDifficulty: (level: TrailDifficulty) => patchState(store, { difficultyLevel: level }),
    clearDifficulty: () => patchState(store, { difficultyLevel: null }),
  })),
);
```


### `trail-card.ts`


```diff
import { TitleCasePipe } from '@angular/common';
+import { Component, computed, inject, input } from '@angular/core';
import { Trail } from './types';
+import { TrailsStore } from './trails-store';

@Component({
  selector: 'app-trails-trail-card',
  imports: [TitleCasePipe],
  template: `
    <div class="card-body">
      <h2 class="card-title text-secondary">{{ trail().name }}</h2>
      <div class="stats stats-vertical lg:stats-horizontal shadow">
        <div class="stat">
          <div class="stat-title">Miles</div>
          <div class="stat-value">{{ trail().miles }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Level</div>
          <div class="stat-value">
            <span
              class="text-[1.3rem]"
              [class.text-success]="trail().difficulty === 'easy'"
              [class.text-info]="trail().difficulty === 'moderate'"
              [class.text-warning]="trail().difficulty === 'hard'"
              [class.text-error]="trail().difficulty === 'extreme'"
              >{{ trail().difficulty | titlecase }}</span
            >
          </div>
        </div>
      </div>
      <div class="card-actions justify-end">
+        @if (store.trailsFavorites.isLoading() || inFlight()) {
          <span class="loading loading-ring loading-xl"></span>
+        } @else {
          <label
            class="label"
            [class.text-success]="trail().favorite"
            [class.text-accent]="!trail().favorite"
          >
            {{ trail().favorite ? 'Favorite!' : 'Mark as Favorite' }}
            <input
              type="checkbox"
              [checked]="trail().favorite"
              (change)="toggleFavorite()"
              class="toggle toggle-sm"
            />
          </label>
 +       }
      </div>
    </div>
  `,

  styleUrl: './trail-card.css',
  host: {
    '[class.ring-4]': 'trail().favorite',
    '[class.ring-success]': 'trail().favorite',
  },
})
export class TrailCard {
  readonly trail = input.required<Trail>();
+ private readonly store = inject(TrailsStore);

  private readonly inFlight = computed(() => {
    const all = this.store.inFlightFavorites();
    return all.some((a) => a === this.trail().id);
  });

  protected toggleFavorite() {
+    if (this.trail().favorite) {
+      this.store.removeFavorite(this.trail().id);
+    } else {
+      this.store.addFavorite(this.trail().id);
+    }
  }
}
```