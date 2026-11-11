# Creating a service for sorting and filtering

In this lab you will create an Angular service and provide it to the trails-list component. We will add a new component that lets the user decide which level of trail they'd like to see in the list.


## Create the service class

In the trails directory, create a new TypeScript file called `trails-data.ts`.

We will create a service class here, with the `@Service()` decorator, and then move the list of hard-coded trails to this service. This is our first step toward making this a bit more "real" - as we'll be retrieving this list from an API later.


```ts
import { Service, signal } from '@angular/core';
import { Trail } from './types';

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

}
```

## Add a computed value to provide the list

You'll notice the `trailList` in the service is *private*. It is *encapsulated* in this service. In the same service, we will provide a public computed value that returns the list. We'll return the list in alphabetical order. 

<details>
<summary>Click here to see the code for the computed property</summary>

```ts
 public readonly list = computed(() => {
    const trails = this.trailList();
    const sorted = trails.toSorted((left, right) => left.name.localeCompare(right.name));
    return sorted;
  });

```

</details>

If you used the JavaScript `toSorted` method, you probably will have a type error. Remember talking about this? See if you can fix it. If not, a hint is below:

<details>
    <summary>How to fix the `toSorted` issue</summary>

    In the `tsconfig.json` in the root of your project, change the "target" property to "ES2024". This will tell the TypeScript compiler that you want to use types and methods in JavaScript that were current as of 2024 (as opposed to 2017, or whatever)

</details>


## Update the trails list

In the trails-list component, we will remove the (now) duplicate list of trails, and inject in our service. We will also update the template to use the data from this service:

```ts
import { Component, inject } from '@angular/core';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';
import { TrailsData } from './trails-data';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="trailsData.list()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (trail of trailsData.list(); track trail.name) {
          <app-trails-trail-card [trail]="trail" class="" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailList {
  private readonly trailsData = inject(TrailsData);
}
```

Your trails list should now be sorted by trail name in the browser.

## Add a display options component

We will add a new component that will be displayed at the top of the trails-list that will allow the user to filter the list by difficulty level. By default, it will show all trails, but the user will be able to indicate if they'd like to see only trails of a specific difficulty.

So that we don't end up repeating the difficulty levels all over our application (and inviting bugs when inevitably they get changed in the future), we will do a little TypeScript magic to give us an enumerable array of the difficulty levels as well as a type definition of that elements of that array as a literal union type.

In `types.ts` - change it to the following:

```ts
export const DifficultyLevel = ['easy', 'moderate', 'hard', 'extreme'] as const;
export type TrailDifficulty = (typeof DifficultyLevel)[number];

export interface Trail {
  name: string;
  miles: number;
  difficulty: TrailDifficulty;
  favorite: boolean;
}

```

In the `trails-data.ts` service, we will add a public property with the difficulty level that is selected, which by default will be null. Add the following property to the service:


```ts
 public readonly difficultyLevel = signal<TrailDifficulty | null>(null);
```

We will also update the computed to take into account this difficulty level as a filter, if it is set. Update the computed `list` property in the service to the following:

```ts
  public readonly list = computed(() => {
    const trails = this.trailList();
    const sorted = trails.toSorted((left, right) => left.name.localeCompare(right.name));
    if (this.difficultyLevel() !== null) {
      return sorted.filter((t) => t.difficulty === this.difficultyLevel());
    }
    return sorted;
  });
```

Manually change the value of the `difficultyLevel` property in your code to `easy`, or `moderate`, etc. and view the results in your browser.

## Create a new display options component

In the trails directory, create a new component called `display-options.ts`. This component will inject the `TrailsData` service, and provide an interface affordance to set the difficulty level to the value the user selects. If you are feeling saucey, try to do it yourself. If you want a suggestion on how I'd do it, you can peek below:

<details>
<summary>Jeff's version of display-options</summary>

```ts
import { Component, inject } from '@angular/core';
import { TrailsData } from './trails-data';
import { DifficultyLevel } from './types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-trails-display-options',
  imports: [TitleCasePipe],
  template: `
    <div class="flex flex-row gap-2">
      <form class="filter">
        <input
          class="btn btn-square"
          type="reset"
          value="×"
          (click)="service.difficultyLevel.set(null)"
        />
        @for (d of difficulutes; track d) {
          <input
            class="btn"
            type="radio"
            name="difficulty"
            [aria-label]="d | titlecase"
            (click)="service.difficultyLevel.set(d)"
          />
        }
      </form>
    </div>
  `,
  styles: ``,
})
export class DisplayOptions {
  private readonly service = inject(TrailsData);
  private readonly difficulutes = DifficultyLevel;
}

```

</details>

## Add the component to the trails list component

Back in the trails-list.ts component, add the new component to the top of the page:

```diff
import { Component, inject } from '@angular/core';
+ import { DisplayOptions } from './display-options';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';
import { TrailsData } from './trails-data';

@Component({
  selector: 'app-trails-list',
+  imports: [TrailStats, TrailCard, DisplayOptions],
  template: `
+    <app-trails-display-options class="p-4" />
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="trailsData.list()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (trail of trailsData.list(); track trail.name) {
          <app-trails-trail-card [trail]="trail" class="" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailList {
  private readonly trailsData = inject(TrailsData);
}
```

## Success! (?)

You should now be able to change the list of trails in the browser.

## Other things

Our trail-stats component really doesn't need an `input` anymore, does it? If you look at the `trails-list`, it has two child components that both need the list of trails. One, (the `trail-stats` component) takes that list as an input from the parent component, and the other (our new `display-options` component) simply injects the same "singleton" trails-data service and uses it. I prefer *that* (using injection), *unless* there is a possibility a component might use a *different* list or something. What do you think?

Another thing: During class, you can *always* ask me for further explanation of *anything*. But also know you have a pretty smart coding partner available to you in the form of an AI Agent. For example, the `types.ts` has some pretty wild stuff going on. Ask copilot to explain it to you. If that doesn't get you there, keep asking. There is no ego "there" to think you are dense or dumb. Take adavantage of it! (one of my most common prompts is something like "explain typescript union types to me like I am a five year old")