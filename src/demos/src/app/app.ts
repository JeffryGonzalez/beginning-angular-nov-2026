import { Component, signal } from '@angular/core';
import { PageHeader } from './widgets/page-header';

@Component({
  imports: [PageHeader],
  selector: 'app-root',
  template: `
    <app-page-header />
    <main class="container mx-auto">
      <p>App Stuff goes here {{ title() }}</p>
    </main>
  `,
})
export class App {
  protected readonly title = signal('demos');

  doYourThing() {
    this.title.update((title) => title.toUpperCase());
  }
}
