import { Component, signal } from '@angular/core';

import { PageHeader } from './headings/page-header/page-header';
import { TrailCard } from './trails/trail-card';

@Component({
  imports: [PageHeader, TrailCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Trail Log');
}
