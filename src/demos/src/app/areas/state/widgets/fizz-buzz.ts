import { Component, computed, inject, input } from '@angular/core';
import { StateData } from '../state-data';

@Component({
  selector: 'app-counter-fizzbuzz',
  imports: [],
  template: `
    @let val = fizzBuzz();
    @switch (val) {
      @case ('Fizz') {
        <p>It is just fizz meaning it is divisible by 3</p>
      }
      @case ('Buzz') {
        <p>It is just buzz, it is divisible by 5</p>
      }
      @case ('FizzBuzz') {
        <p>{{ winnerMessage() }}</p>
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
export class FizzBuzz {
  private readonly service = inject(StateData);
  winnerMessage = input('Yay Fizzbuzz');
  fizzBuzz = computed(() => {
    const current = this.service.current();
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
