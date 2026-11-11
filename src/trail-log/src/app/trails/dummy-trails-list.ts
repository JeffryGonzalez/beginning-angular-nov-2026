import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';

interface ApiTrailItem {
  id: string;
  name: string;
  miles: number;
  difficulty: string;
}
@Component({
  selector: 'app-dummy-trails-list',
  imports: [],
  template: `
    @if (trailsResource.isLoading()) {
      <p>Getting the trails...</p>
    } @else {
      @for (trail of trailsResource.value(); track trail.id) {
        <p>{{ trail.id }} is {{ trail.name }} and it is {{ trail.difficulty }}</p>
      } @empty {
        <p>Sorry, no trails!</p>
      }
    }
  `,
  styles: ``,
})
export class DummyTrailsList {
  private readonly trailsResource = httpResource<ApiTrailItem[]>(() => '/api/trails');
}
