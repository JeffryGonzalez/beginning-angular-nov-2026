import { Component, signal } from '@angular/core';

import { PageHeader } from './headings/page-header/page-header';
import { TrailList } from './trails/trails-list';

@Component({
  imports: [PageHeader, TrailList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Trail Log');
}
