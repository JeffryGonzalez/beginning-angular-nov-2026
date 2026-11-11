import { Component, inject } from '@angular/core';
import { TrailsStore } from './trails-store';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-trails-display-options-buttons',
  imports: [TitleCasePipe],
  template: `
    <div class="join py-4">
      <button
        [disabled]="store.difficultyLevel() === null"
        (click)="store.clearDifficulty()"
        class="btn"
      >
        All
      </button>
      @for (d of store.difficultyLevels; track d) {
        <button
          [disabled]="store.difficultyLevel() === d"
          (click)="store.setDifficulty(d)"
          class="btn"
        >
          {{ d | titlecase }}
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class DisplayOptionsButton {
  private readonly store = inject(TrailsStore);
}
