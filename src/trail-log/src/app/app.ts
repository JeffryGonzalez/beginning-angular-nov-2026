import { Component, inject, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ExpensiveService } from './dev/expensive-service';
import { PageHeader } from './headings/page-header/page-header';

@Component({
  imports: [PageHeader, RouterOutlet],

  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Trail Log');

  private readonly service = inject(ExpensiveService);
}
