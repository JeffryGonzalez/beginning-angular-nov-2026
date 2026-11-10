import { Component, signal } from '@angular/core';
import { HeaderLinks } from './header-links';
import { IconsMenu } from './icons-menu';
import { Link } from './types';

@Component({
  selector: 'app-page-header',
  imports: [IconsMenu, HeaderLinks],
  template: `<div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <app-icons-menu />
        </div>

        <app-header-links [links]="myLinks()" kind="vertical" />
      </div>
      <a class="btn btn-ghost text-xl">Beginning Angular</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <app-header-links [links]="myLinks()" kind="horizontal" />
    </div>
    <div class="navbar-end">
      <a class="btn">Login</a>
    </div>
  </div> `,
  styles: ``,
})
export class PageHeader {
  private readonly myLinks = signal<Link[]>([
    {
      title: 'Home',
      link: 'home',
    },
    {
      title: 'State',
      link: 'state',
    },
    {
      title: 'About',
      link: 'about',
    },
  ]);
}
