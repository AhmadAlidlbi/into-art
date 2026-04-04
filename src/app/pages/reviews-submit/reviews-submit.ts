import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ReviewsSubmitService } from './services/reviews-submit.service';

@Component({
  selector: 'app-reviews-submit',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './reviews-submit.html',
  styleUrl: './reviews-submit.scss',
})
export class ReviewsSubmitComponent {
  stars = [1, 2, 3, 4, 5];

  submitted = false;
  ratingTouched = false;
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  form = {
    clientName: '',
    rating: 0,
    reviewText: '',
  };

  constructor(private reviewsSubmitService: ReviewsSubmitService) {}

  get ratingInvalid(): boolean {
    return this.form.rating < 1;
  }

  get showRatingError(): boolean {
    return this.ratingInvalid && this.ratingTouched;
  }

  setRating(value: number): void {
    this.form.rating = value;
    this.ratingTouched = true;
  }

  async submitReview(formRef: NgForm): Promise<void> {
    this.submitted = false;
    this.submitError.set(null);
    this.ratingTouched = true;

    if (formRef.invalid || this.ratingInvalid) {
      formRef.control.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const response = await this.reviewsSubmitService.submitReview({
        clientName: this.form.clientName.trim(),
        rating: String(this.form.rating),
        reviewText: this.form.reviewText.trim(),
      });

      if (response.ok) {
        this.submitted = true;
        this.ratingTouched = false;

        this.form = {
          clientName: '',
          rating: 0,
          reviewText: '',
        };

        formRef.resetForm({
          clientName: '',
          rating: 0,
          reviewText: '',
        });
      } else {
        this.submitError.set(response.error || 'Failed to submit review');
      }
    } catch {
      this.submitError.set('Failed to submit review');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}