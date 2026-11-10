import { Component } from '@angular/core';
import { TreeIcon } from '../../widgets/icons/tree-icon';

@Component({
  selector: 'app-mast-head',
  imports: [TreeIcon],
  template: `
    <a href="/" class="btn btn-ghost text-xl dark:text-green-400 text-green-700">
      <app-tree-icon />
      Trail Log</a
    >
  `,
  styles: `
    :host {
      @apply flex-1;
    }
  `,
})
export class MastHead {}
