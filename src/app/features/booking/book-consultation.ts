import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService, ConsultationPayload } from './services/booking.service';

// your custom date picker (already added earlier)
import { DatePickerComponent } from './components/date-picker/date-picker';
// new time slots
import { TimeSlotsComponent } from './components/time-slots/time-slots';

type BookingForm = FormGroup<{
  fullName: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  area: FormControl<string>;
  propertyType: FormControl<'Villa' | 'Apartment' | 'Room' | 'Office' | 'Other'>;
  preferredDate: FormControl<string>;
  preferredHour: FormControl<string>; // "HH:mm"
  contactPreference: FormControl<'WhatsApp' | 'Call' | 'Email'>;
  message: FormControl<string>;
}>;

@Component({
  selector: 'app-book-consultation',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DatePickerComponent, TimeSlotsComponent],
  templateUrl: './book-consultation.html',
  styleUrls: ['./book-consultation.scss'],
})
export class BookConsultationPage {
  whatsappNumber = '96550000000';
  phoneNumber = '+965 5000 0000';

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  form!: BookingForm;

  todayISO = computed(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  selectedDateISO = computed(() => this.form?.controls.preferredDate.value || '');

  constructor(
    private fb: FormBuilder,
    private booking: BookingService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      fullName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      phone: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.pattern(/^[0-9+\-\s]{6,20}$/),
      ]),
      email: this.fb.nonNullable.control('', [Validators.email]),
      area: this.fb.nonNullable.control(''),
      propertyType: this.fb.nonNullable.control<'Villa' | 'Apartment' | 'Room' | 'Office' | 'Other'>(
        'Apartment',
        [Validators.required]
      ),

      // date from date picker (yyyy-mm-dd)
      preferredDate: this.fb.nonNullable.control('', [Validators.required]),

      // NEW: hour slot (HH:mm)
      preferredHour: this.fb.nonNullable.control('', [Validators.required]),

      contactPreference: this.fb.nonNullable.control<'WhatsApp' | 'Call' | 'Email'>('WhatsApp', [
        Validators.required,
      ]),
      message: this.fb.nonNullable.control(''),
    }) as BookingForm;
  }

  openWhatsApp(): void {
    window.open(`https://wa.me/${this.whatsappNumber}`, '_blank', 'noopener,noreferrer');
  }

  callNow(): void {
    window.open(`tel:${this.phoneNumber.replace(/\s/g, '')}`, '_self');
  }

  private toPayload(): ConsultationPayload {
    const v = this.form.getRawValue();

    return {
      fullName: v.fullName.trim(),
      phone: v.phone.trim(),
      email: v.email.trim() || null,
      area: v.area.trim() || null,
      propertyType: v.propertyType,
      preferredDate: v.preferredDate,
      preferredHour: v.preferredHour, // "HH:mm"
      message: v.message.trim() || null,
      contactPreference: v.contactPreference,
    };
  }

  async submit(): Promise<void> {
    this.submitError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitError.set('Please review the required fields and try again.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload = this.toPayload();
      const res = await this.booking.submitConsultation(payload);

      if (!res.ok) {
        this.submitError.set('Submission failed. Please try again.');
        return;
      }

      this.router.navigateByUrl('/book-consultation/success');
    } catch {
      this.submitError.set('Something went wrong. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
