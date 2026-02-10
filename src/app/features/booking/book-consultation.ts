import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService, ConsultationPayload } from './services/booking.service';

/* Angular Material */
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/* NEW TYPES */
type BuildingCondition = 'New building' | 'Restoration' | 'Other';

type DesignPackage =
  | 'Two-space design package'
  | '4-space design package'
  | '5-space design package'
  | 'Floor Design Package'
  | 'Complete coupon design package';

@Component({
  selector: 'app-book-consultation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './book-consultation.html',
  styleUrls: ['./book-consultation.scss'],
})
export class BookConsultationPage {
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  availableHours = signal<string[]>([]);

  today = new Date();
  private readonly BLOCKED_DAY = 5; // Friday
  private readonly HOURS = ['09:00', '10:30', '12:00', '14:00', '16:00', '18:00'];

  form; // ← declare only

  constructor(private fb: FormBuilder, private booking: BookingService, private router: Router) {
    // ✅ initialize AFTER fb exists
    this.form = this.fb.nonNullable.group({
      /* REQUIRED */
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', Validators.required],

      /* BUILDING CONDITION */
      buildingCondition: this.fb.nonNullable.control<'New building' | 'Restoration' | 'Other'>(
        'New building',
        Validators.required
      ),
      buildingConditionOther: [''],

      /* DESIGN PACKAGE */
      designPackage: this.fb.nonNullable.control<
        | 'Two-space design package'
        | '4-space design package'
        | '5-space design package'
        | 'Floor Design Package'
        | 'Complete coupon design package'
      >('Two-space design package', Validators.required),

      /* DATE + TIME */
      preferredDate: [null as Date | null, Validators.required],
      preferredHour: ['', Validators.required],
    });
  }

  /** Disable Fridays */
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getDay() !== this.BLOCKED_DAY;
  };

  onDateSelected(date: Date | null): void {
    this.availableHours.set([]);
    this.form.controls.preferredHour.reset();

    if (!date) return;
    this.availableHours.set(this.HOURS);
  }

  selectHour(hour: string): void {
    this.form.controls.preferredHour.setValue(hour);
  }

  openWhatsApp(): void {
    window.open('https://wa.me/96550000000', '_blank', 'noopener');
  }

  callNow(): void {
    window.open('tel:+96550000000');
  }

  private toPayload(): ConsultationPayload {
    const v = this.form.getRawValue();

    return {
      fullName: v.fullName.trim(),
      phone: v.phone.trim(),

      buildingCondition: v.buildingCondition,
      buildingConditionOther:
        v.buildingCondition === 'Other' ? v.buildingConditionOther?.trim() || null : null,

      designPackage: v.designPackage,

      preferredDate: v.preferredDate ? v.preferredDate.toISOString().split('T')[0] : '',
      preferredHour: v.preferredHour,
    };
  }

  async submit(): Promise<void> {
    this.submitError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const res = await this.booking.submitConsultation(this.toPayload());

      if (res.ok) {
        this.router.navigateByUrl('/book-consultation/success');
      } else {
        this.submitError.set('Submission failed. Please try again.');
      }
    } catch {
      this.submitError.set('Something went wrong. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
