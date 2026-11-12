import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Trail } from '../trails/types';
import { ApiReview, ReviewCreateModel } from './types';

@Component({
  selector: 'app-trail-reviews',
  imports: [RouterLink, FormRoot, FormField],
  template: `
    @if (trailItemResource.hasValue()) {
      <h1 class="text-3xl font-black">{{ trailItemResource.value().name }}</h1>
    }

    <a routerLink="" class="btn btn-primary">Back</a>

    <div class="flex flex-row gap-r">
      <form [formRoot]="form" class="w-1/2">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">What is your review</legend>
          <textarea
            [formField]="form.review"
            type="text"
            class="textarea"
            placeholder="Type here"
          ></textarea>
          @let review = form.review;
          @if (review().invalid() && (review().touched() || review().dirty())) {
            <div class="alert alert-error">
              @if (review().getError('required')) {
                <p>This is required!</p>
              }
              @if (review().getError('minLength')) {
                <p>Not Long Enough</p>
              }
            </div>
          }
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Did you hike the trail?</legend>
          <label class="label">
            <input [formField]="form.hiked" type="checkbox" class="checkbox" />
            I Hiked!
          </label>
        </fieldset>
        @if (form().submitting()) {
          <span class="btn btn-accent opacity-50">Submitting...</span>
        } @else {
          <button [aria-disabled]="form().invalid()" type="submit" class="btn btn-accent">
            Submit Review
          </button>
        }
      </form>
      <ul class="w-1/2 ">
        @for (review of reviewsForTrail(); track review.id) {
          <li>On {{ review.dateOfReview }}: {{ review.review }}</li>
        } @empty {
          <li><p>No Reviews Yet!</p></li>
        }
      </ul>
    </div>
  `,
  styles: ``,
})
export class Reviews {
  id = input.required<string>();
  private readonly router = inject(Router);
  private readonly reviewsResource = httpResource<ApiReview[]>(() => '/api/user/reviews');
  private readonly trailItemResource = httpResource<Trail>(() => `/api/trails/${this.id()}`);

  private readonly reviewsForTrail = computed(() => {
    const reviews = this.reviewsResource.value() || [];
    return reviews.filter((r) => r.trailId === this.id());
  });
  // the "defaults" you want to display for each field
  private readonly model = signal<ReviewCreateModel>({
    hiked: false,
    review: '',
    trailId: '',
  });

  private readonly form = form(
    this.model,
    (tree) => {
      required(tree.review, { message: 'What good is a review without the review?' });
      minLength(tree.review, 5);
      maxLength(tree.review, 100);
    },
    {
      submission: {
        action: async () => {
          const reviewToPost: ReviewCreateModel = {
            hiked: this.model().hiked,
            review: this.model().review,
            trailId: this.id(),
          };

          const response = await fetch('/api/user/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewToPost),
          });

          // do error handling here
          if (!response.ok) {
            console.error(response);
            return { kind: 'serverError', message: 'Something went wrong on the post' };
          }
          // reload the list so you can see it - if you think they will add more reviews.

          // or you could send them back to the list?
          this.router.navigate(['']);
          return;
        },
      },
    },
  );
}
