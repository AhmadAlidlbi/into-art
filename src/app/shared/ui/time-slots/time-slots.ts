import { CommonModule } from '@angular/common';
import { Component, Input, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type Slot = {
  label: string;       // e.g. "6:00 PM"
  value: string;       // "18:00"
  disabled: boolean;
  selected: boolean;
};

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-slots.html',
  styleUrls: ['./time-slots.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeSlotsComponent),
      multi: true,
    },
  ],
})
export class TimeSlotsComponent implements ControlValueAccessor {
  /** Selected date ISO (yyyy-mm-dd). Used to disable past slots if date is today. */
  @Input() selectedDateISO: string | null = null;

  /** Working hours start (24h) */
  @Input() startHour = 10;

  /** Working hours end (24h). If includeEnd=true, end hour is selectable. */
  @Input() endHour = 20;

  /** Step minutes: 60 = hourly, 30 = half-hour */
  @Input() stepMinutes = 60;

  /** Minimum lead time for same-day bookings (in minutes). */
  @Input() minLeadMinutes = 60;

  /** Block weekday: 0=Sun..6=Sat (Friday = 5) */
  @Input() blockedWeekdays: number[] = [5];

  /** UI label */
  @Input() label = 'Preferred hour *';

  isDisabled = signal(false);
  private _value = signal<string>(''); // "HH:mm"
  value = computed(() => this._value());

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  slots = computed<Slot[]>(() => {
    const dateISO = (this.selectedDateISO ?? '').trim();
    const selected = this.value();

    const isFridayOrBlocked = dateISO ? this.blockedWeekdays.includes(this.weekdayFromISO(dateISO)) : false;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const leadCutoff = nowMinutes + this.minLeadMinutes;

    const isToday = dateISO ? dateISO === this.todayISO() : false;

    const out: Slot[] = [];
    const start = this.startHour * 60;
    const end = this.endHour * 60;

    for (let m = start; m <= end; m += this.stepMinutes) {
      const hh = Math.floor(m / 60);
      const mm = m % 60;
      const value = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;

      const disabled =
        this.isDisabled() ||
        !dateISO ||
        isFridayOrBlocked ||
        (isToday && m < leadCutoff);

      out.push({
        value,
        label: this.to12hLabel(hh, mm),
        disabled,
        selected: !!selected && selected === value,
      });
    }

    return out;
  });

  helperText = computed(() => {
    const dateISO = (this.selectedDateISO ?? '').trim();
    if (!dateISO) return 'Select a date first to see available hours.';
    if (this.blockedWeekdays.includes(this.weekdayFromISO(dateISO))) return 'This day is unavailable.';
    return `Available hours: ${this.startHour}:00 to ${this.endHour}:00`;
  });

  pick(slot: Slot): void {
    this.onTouched();
    if (slot.disabled) return;

    this._value.set(slot.value);
    this.onChange(slot.value);
  }

  // CVA
  writeValue(value: string | null): void {
    this._value.set((value ?? '').trim());
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // helpers
  private todayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private weekdayFromISO(iso: string): number {
    // local midnight to avoid timezone drift
    const d = new Date(`${iso}T00:00:00`);
    return d.getDay();
  }

  private to12hLabel(h: number, m: number): string {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm} ${ampm}`;
  }
}
