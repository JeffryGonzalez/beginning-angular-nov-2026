import { Component, inject } from '@angular/core';
import { StateStore } from '../state-store';

@Component({
  selector: 'app-prefs',
  providers: [],
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
  private readonly service = inject(StateStore);
}
