import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-area-state',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div class="flex flex-row gap-4">
      <a
        [routerLinkActive]="['text-bold', 'underline']"
        class="btn btn-sm btn-primary "
        routerLink="home"
        >Home</a
      >
      <a
        [routerLinkActive]="['text-bold', 'underline']"
        class="btn btn-sm btn-primary"
        routerLink="signals"
        >Signals</a
      >
      <a
        [routerLinkActive]="['text-bold', 'underline']"
        class="btn btn-sm btn-primary"
        routerLink="prefs"
        >Prefs</a
      >
      <a
        [routerLinkActive]="['text-bold', 'underline']"
        class="btn btn-sm btn-primary"
        routerLink="resources"
        >Resources</a
      >
      <a
        [routerLinkActive]="['text-bold', 'underline']"
        class="btn btn-sm btn-primary"
        routerLink="rest"
        >More Signals Stuff</a
      >
    </div>
    <div class="p-4">
      <router-outlet />
    </div>
  `,
  styles: ``,
})
export class State {}
