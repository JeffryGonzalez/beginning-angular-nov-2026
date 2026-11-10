import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-areas-state-pages-signals',
  imports: [],
  template: `
    <div>
      <button (click)="current.update((c) => c - 1)" class="btn btn-primary">-</button
      ><span class="p-2" [class.text-3xl]="isEven()">{{ current() }}</span
      ><button (click)="current.update((c) => c + 1)" class="btn btn-primary">+</button>
    </div>
    @let val = fizzBuzz();
    @switch (val) {
      @case ('Fizz') {
        <p>It is just fizz meaning it is divisible by 3</p>
      }
      @case ('Buzz') {
        <p>It is just buzz, it is divisible by 5</p>
      }
      @case ('FizzBuzz') {
        <p>It is FIZZBUZZ!!!!!</p>
      }
      @case ('') {
        <p>Nothing!</p>
      }
      @case ('Zero') {
        <p>Zero!</p>
      }

      @default never;
    }
  `,
  styles: ``,
})
export class Signals {
  current = signal(0);

  isEven = computed(() => {
    const current = this.current();
    return current % 2 === 0;
  });

  fizzBuzz = computed(() => {
    const current = this.current();
    if (current === 0) {
      return 'Zero';
    }
    if (current % 3 === 0 && current % 5 === 0) {
      return 'FizzBuzz';
    }
    if (current % 3 === 0) {
      return 'Fizz';
    }
    if (current % 5 === 0) {
      return 'Buzz';
    }
    return '';
  });
}
