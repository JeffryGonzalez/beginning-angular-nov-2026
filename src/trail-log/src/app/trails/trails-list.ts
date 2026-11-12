import { Component, inject } from '@angular/core';
import { DisplayOptionsButton } from './display-options-button';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';
import { TrailsStore } from './trails-store';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard, DisplayOptionsButton],
  template: `
    @if (trailsData.trailsResource.isLoading()) {
      <span class="loading loading-spinner text-primary"></span>
      <span class="loading loading-spinner text-secondary"></span>
      <span class="loading loading-spinner text-accent"></span>
      <span class="loading loading-spinner text-neutral"></span>
      <span class="loading loading-spinner text-info"></span>
      <span class="loading loading-spinner text-success"></span>
      <span class="loading loading-spinner text-warning"></span>
      <span class="loading loading-spinner text-error"></span>
    } @else {
      <app-trails-display-options-buttons class="p-4" />
      <div class="flex flex-col md:flex-row gap-4">
        <app-trail-stats [trailList]="trailsData.list()"> </app-trail-stats>
        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
          @for (trail of trailsData.list(); track trail.name) {
            <app-trails-trail-card [trail]="trail" class="" />
          }
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class TrailList {
  private readonly trailsData = inject(TrailsStore);
}
