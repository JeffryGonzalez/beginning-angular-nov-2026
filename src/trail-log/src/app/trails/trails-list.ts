import { Component, inject } from '@angular/core';
import { DisplayOptions } from './display-options';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';
import { TrailsData } from './trails-data';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard, DisplayOptions],
  template: `
    <app-trails-display-options class="p-4" />
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
