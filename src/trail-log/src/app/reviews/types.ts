export type ApiReview = {
  id: string;
  trailId: string;
  review: string;
  hiked: boolean;
  dateOfReview: string;
};

export type ReviewCreateModel = Omit<ApiReview, 'id' | 'dateOfReview'>;
