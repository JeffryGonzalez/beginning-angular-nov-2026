import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TrailsStore } from './trails-store';

@Component({
  selector: 'app-trails-display-options',
  imports: [TitleCasePipe],
  providers: [],
  template: `
    <div class="flex flex-row gap-2">
      <form class="filter">
        <input class="btn btn-square" type="reset" value="×" (click)="service.clearDifficulty()" />
        @for (d of service.difficultyLevels; track d) {
          <input
            class="btn"
            type="radio"
            name="difficulty"
            [aria-label]="d | titlecase"
            (click)="service.setDifficulty(d)"
          />
        }
      </form>
    </div>
  `,
  styles: ``,
})
export class DisplayOptions {
  private readonly service = inject(TrailsStore);
}
