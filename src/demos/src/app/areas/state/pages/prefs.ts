import { Component, inject, signal } from '@angular/core';
import { StateData } from '../state-data';

@Component({
  selector: 'app-prefs',
  imports: [],
  template: `
    <div class="join">
      <button (click)="service.setBy(1)" [disabled]="service.by() === 1" class="btn join-item">
        1
      </button>
      <button (click)="service.setBy(3)" [disabled]="service.by() === 3" class="btn join-item">
        3
      </button>
      <button (click)="service.setBy(5)" [disabled]="service.by() === 5" class="btn join-item">
        5
      </button>
    </div>
  `,
  styles: ``,
})
export class Prefs {
  private readonly service = inject(StateData);
}
