import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../core/theme/theme.service';
import { ReviewsSubmitService } from './services/reviews-submit.service';

@Component({
  selector: 'app-reviews-submit',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './reviews-submit.html',
  styleUrl: './reviews-submit.scss',
})
export class ReviewsSubmitComponent {
  private themeService = inject(ThemeService);
  isDark = this.themeService.isDark;

  stars = [1, 2, 3, 4, 5];

  submitted = false;
  ratingTouched = false;
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  currentLang = signal<'ar' | 'en'>('en');

  form = {
    clientName: '',
    rating: 0,
    reviewText: '',
  };

  constructor(
    private reviewsSubmitService: ReviewsSubmitService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const activeLang =
      (this.translate.currentLang || this.translate.getDefaultLang() || 'en') === 'ar'
        ? 'ar'
        : 'en';

    this.currentLang.set(activeLang);
    this.applyDocumentLanguage(activeLang);
  }

  get ratingInvalid(): boolean {
    return this.form.rating < 1;
  }

  get showRatingError(): boolean {
    return this.ratingInvalid && this.ratingTouched;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    const nextLang = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.currentLang.set(nextLang);
    this.translate.use(nextLang);
    this.applyDocumentLanguage(nextLang);
  }

  private applyDocumentLanguage(lang: 'ar' | 'en'): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  hoveredRating = 0;

  onStarHover(value: number): void {
    this.hoveredRating = value;
  }

  onStarLeave(): void {
    this.hoveredRating = 0;
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
