import { Component, computed, inject, input } from '@angular/core';
import { StateData } from '../state-data';
import { StateStore } from '../state-store';

@Component({
  selector: 'app-counter-fizzbuzz',
  imports: [],
  template: `
    @let val = service.fizzBuzz();
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
  private readonly service = inject(StateStore);
  winnerMessage = input('Yay Fizzbuzz');
}
