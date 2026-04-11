import { CommonModule } from '@angular/common';
import { Component, signal, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService, ConsultationPayload } from './services/booking.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { SundayFirstDateAdapter } from './sunday-date-adapter';

// ─── Slot definitions (stored as 24h for backend, displayed as 12h AM/PM) ───
const HOURS_SAT_WED = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:00'];
const HOURS_THU = ['10:00', '11:30', '13:00'];

const BLOCKED_DAY = 5; // Friday
const THURSDAY = 4;

// ─── Day names ───────────────────────────────────────────
const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ─── 24h → 12h AM/PM display ────────────────────────────
function to12h(time24: string, lang: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const suffix = h < 12 ? (lang === 'ar' ? 'ص' : 'AM') : lang === 'ar' ? 'م' : 'PM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
}

export interface SlotDisplay {
  raw: string;
  display: string;
}

@Component({
  selector: 'app-book-consultation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  // ✅ Sunday as first day of the week in the date picker
  providers: [{ provide: DateAdapter, useClass: SundayFirstDateAdapter }],
  templateUrl: './book-consultation.html',
  styleUrls: ['./book-consultation.scss'],
})
export class BookConsultationPage implements OnDestroy {
  isSubmitting = signal(false);
  hasSelectedDate = signal(false);
  timeTaken = signal(false);
  loadingSlots = signal(false);
  submitError = signal<string | null>(null);

  slotsForDay = signal<SlotDisplay[]>([]);
  availableHours = signal<string[]>([]);
  selectedDayName = signal<string>('');

  readonly today = new Date();

  private currentDate: Date | null = null;
  private slotsCache = new Map<string, string[]>();
  private langSub: Subscription;

  form;

  constructor(
    private fb: FormBuilder,
    private booking: BookingService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.form = this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', Validators.required],

      buildingCondition: this.fb.nonNullable.control<'New building' | 'Restoration' | 'Other'>(
        'New building',
        Validators.required
      ),
      buildingConditionOther: [''],

      designPackage: this.fb.nonNullable.control<
        | 'Two-space design package'
        | '4-space design package'
        | '5-space design package'
        | 'Floor Design Package'
        | 'Complete coupon design package'
      >('Two-space design package', Validators.required),

      preferredDate: [null as Date | null, Validators.required],
      preferredHour: ['', Validators.required],
    });

    this.langSub = this.translate.onLangChange.subscribe(() => {
      if (this.currentDate) {
        this.refreshLabels(this.currentDate);
      }
    });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private rawSlotsForDate(date: Date): string[] {
    return date.getDay() === THURSDAY ? HOURS_THU : HOURS_SAT_WED;
  }

  private toDisplaySlots(rawSlots: string[]): SlotDisplay[] {
    const lang = this.translate.currentLang ?? 'ar';
    return rawSlots.map((r) => ({ raw: r, display: to12h(r, lang) }));
  }

  private dayName(date: Date): string {
    const lang = this.translate.currentLang ?? 'ar';
    const names = lang === 'ar' ? DAY_NAMES_AR : DAY_NAMES_EN;
    return names[date.getDay()];
  }

  private refreshLabels(date: Date): void {
    const rawSlots = this.rawSlotsForDate(date);
    this.slotsForDay.set(this.toDisplaySlots(rawSlots));
    this.selectedDayName.set(this.dayName(date));
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getDay() !== BLOCKED_DAY;
  };

  async onDateSelected(date: Date | null): Promise<void> {
    this.currentDate = date;
    this.hasSelectedDate.set(!!date);
    this.timeTaken.set(false);
    this.form.controls.preferredHour.reset();
    this.slotsForDay.set([]);
    this.availableHours.set([]);
    this.selectedDayName.set('');

    if (!date) return;

    const rawSlots = this.rawSlotsForDate(date);
    this.slotsForDay.set(this.toDisplaySlots(rawSlots));
    this.selectedDayName.set(this.dayName(date));

    const iso = this.formatLocalDate(date);

    if (this.slotsCache.has(iso)) {
      const booked = this.slotsCache.get(iso)!;
      this.availableHours.set(rawSlots.filter((h) => !booked.includes(h)));
      return;
    }

    this.loadingSlots.set(true);
    try {
      const res = await this.booking.getBookedSlots(iso);
      this.slotsCache.set(iso, res.bookedSlots);
      this.availableHours.set(rawSlots.filter((h) => !res.bookedSlots.includes(h)));
    } finally {
      this.loadingSlots.set(false);
    }
  }

  selectHour(raw: string): void {
    this.timeTaken.set(false);
    this.form.controls.preferredHour.setValue(raw);
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

    if (
      this.form.controls.buildingCondition.value === 'Other' &&
      !this.form.controls.buildingConditionOther.value?.trim()
    ) {
      this.form.controls.buildingConditionOther.setErrors({ required: true });
      this.form.controls.buildingConditionOther.markAsTouched();
      this.form.markAllAsTouched();
      return;
    }

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
        const v2 = this.form.getRawValue();
        this.router.navigate(['/book-consultation/success'], {
          state: {
            fullName: v2.fullName.trim(),
            preferredDate: this.formatLocalDate(v2.preferredDate!),
            preferredHour: v2.preferredHour,
          },
        });
      } else {
        this.submitError.set('booking.form.errorRetry');
      }
    } catch {
      this.submitError.set('booking.form.errorGeneric');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
