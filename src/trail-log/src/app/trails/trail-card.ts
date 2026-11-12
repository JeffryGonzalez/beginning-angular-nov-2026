import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Trail } from './types';
import { TrailsStore } from './trails-store';

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
        @if (store.trailsFavorites.isLoading() || inFlight()) {
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
  private readonly store = inject(TrailsStore);

  private readonly inFlight = computed(() => {
    const all = this.store.inFlightFavorites();
    return all.some((a) => a === this.trail().id);
  });

  protected toggleFavorite() {
    if (this.trail().favorite) {
      this.store.removeFavorite(this.trail().id);
    } else {
      this.store.addFavorite(this.trail().id);
    }
  }
}
