import { Component, computed, inject, signal } from '@angular/core';
import { FizzBuzz } from '../widgets/fizz-buzz';
import { StateData } from '../state-data';

@Component({
  selector: 'app-areas-state-pages-signals',
  imports: [FizzBuzz],
  template: `
    <div>
      <button (click)="service.decrement()" class="btn btn-primary">-</button
      ><span class="p-2">{{ service.current() }}</span
      ><button (click)="service.increment()" class="btn btn-primary">+</button>
    </div>
    <app-counter-fizzbuzz [winnerMessage]="msg()" />
  `,
  styles: ``,
})
export class Signals {
  private readonly service = inject(StateData);

  msg = signal('Winner winner chicken dinner!');
}
