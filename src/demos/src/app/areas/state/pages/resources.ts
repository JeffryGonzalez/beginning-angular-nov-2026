import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-state-resources',
  imports: [],
  template: `
    @if (postResource.hasValue()) {
      <ul>
        @for (post of postResource.value(); track post.id) {
          <li>{{ post.title }}</li>
        }
      </ul>
    }
  `,
  styles: ``,
})
export class Resources {
  private readonly postResource = httpResource<{ id: string; title: string }[]>(
    () => 'https://jsonplaceholder.typicode.com/posts',
  );
}
