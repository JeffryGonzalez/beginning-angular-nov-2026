import { Component, signal } from '@angular/core';
import { PageHeader } from './widgets/page-header';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [PageHeader, RouterOutlet],
  selector: 'app-root',
  template: `
    <app-page-header />

    <main class="container mx-auto">
      <router-outlet />
    </main>
  `,
})
export class App {
  protected readonly title = signal('demos');

  doYourThing() {
    this.title.update((title) => title.toUpperCase());
  }
}
