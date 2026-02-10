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
  hasSelectedDate = signal(false);
  timeTaken = signal(false);
  loadingSlots = signal(false);
  submitError = signal<string | null>(null);
  availableHours = signal<string[]>([]);

  today = new Date();
  private readonly BLOCKED_DAY = 5; // Friday
  public readonly HOURS = ['09:00', '10:30', '12:00', '14:00', '16:00', '18:00'];
  private slotsCache = new Map<string, string[]>();

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

  async onDateSelected(date: Date | null) {
    this.hasSelectedDate.set(!!date);
    this.timeTaken.set(false);

    this.form.controls.preferredHour.reset();
    this.availableHours.set([]);

    if (!date) return;

    const iso = this.formatLocalDate(date);

    // ✅ use cache if available
    if (this.slotsCache.has(iso)) {
      this.availableHours.set(this.slotsCache.get(iso)!);
      return;
    }

    // ⏳ show loading instantly
    this.loadingSlots.set(true);

    try {
      const res = await this.booking.getBookedSlots(iso);
      const free = this.HOURS.filter((h) => !res.bookedSlots.includes(h));

      // ✅ cache result
      this.slotsCache.set(iso, free);
      this.availableHours.set(free);
    } finally {
      this.loadingSlots.set(false);
    }
  }

  selectHour(hour: string): void {
    this.timeTaken.set(false);
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

      preferredDate: v.preferredDate ? this.formatLocalDate(v.preferredDate) : '',
      preferredHour: v.preferredHour,
    };
  }

  private formatLocalDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async submit(): Promise<void> {
    this.submitError.set(null);
    this.timeTaken.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const res = await this.booking.submitConsultation(this.toPayload());

      if (!res.ok && res.error?.includes('already booked')) {
        this.timeTaken.set(true);

        const d = this.form.controls.preferredDate.value;
        if (d) {
          this.slotsCache.delete(this.formatLocalDate(d));
          await this.onDateSelected(d);
        }
        return;
      }

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
