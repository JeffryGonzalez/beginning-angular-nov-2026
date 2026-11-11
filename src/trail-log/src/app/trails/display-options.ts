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
