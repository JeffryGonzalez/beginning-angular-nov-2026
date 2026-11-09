import { Component, input, signal } from '@angular/core';
import { Link } from './types';

@Component({
  selector: 'app-header-links',
  imports: [],
  template: `
    <ul [class]="kind() === 'horizontal' ? horizontalClasses : dropDownClasses">
      @for (link of links(); track link.link) {
        <li>
          <a href="{{ link.link }}">{{ link.title }}</a>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class HeaderLinks {
  kind = input.required<'horizontal' | 'vertical'>();
  links = input.required<Link[]>();

  private readonly dropDownClasses =
    'menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow';
  private readonly horizontalClasses = 'menu menu-horizontal px-1';
}
