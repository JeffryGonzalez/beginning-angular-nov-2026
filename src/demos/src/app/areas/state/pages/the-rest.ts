import { Component, computed, effect, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-pages-state-the-rest',
  imports: [],
  template: `
    <select class="select" (change)="setPet($event)">
      @for (p of pets(); track $index; let i = $index) {
        <option [value]="i" [selected]="selectedPet() === p">{{ p }}</option>
      }
    </select>

    <div>
      <p class="text-2xl font-bold">{{ selectedPet() }}</p>
    </div>
  `,
  styles: ``,
})
export class TheRest {
  constructor() {
    effect(() => {
      const current = this.selectedPet();
      console.log(`The user just selected a ${current}`);
    });
  }
  // this list is coming from an API or something, and isn't hard-coded right here.
  private readonly pets = signal(['Budgie', 'Dog', 'Cat', 'Mouse', 'Hamster']);

  // linked signal is a signal that you can treat like a computed "at first", but then set it later.
  private readonly selectedPet = linkedSignal(() => this.pets()[0]);

  private readonly petReallyBig = computed(() => {
    const p = this.selectedPet();
    return p.toUpperCase();
  });

  setPet(event: Event) {
    const index = Number((event.target as HTMLSelectElement).value);
    this.selectedPet.set(this.pets()[index]);
  }
}
