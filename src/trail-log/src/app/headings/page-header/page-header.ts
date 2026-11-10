import { Component, signal } from '@angular/core';
import { ExternalLink } from '../../widgets/icons/external-link';
import { MastHead } from './mast-head';

@Component({
  imports: [ExternalLink, MastHead],
  selector: 'app-page-header',
  styleUrl: './page-header.css',
  templateUrl: './page-header.html',
})
export class PageHeader {
  protected readonly links = signal([
    {
      href: 'https://angular.dev',
      linkText: 'Angular Docs',
    },
    {
      href: 'https://class.hypertheory-labs.dev',
      linkText: 'Class Site',
    },
  ]);
}
