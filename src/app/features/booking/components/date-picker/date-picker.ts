import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostListener, Input, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type DayCell = {
  kind: 'blank' | 'day';
  label?: number;
  iso?: string; // yyyy-mm-dd
  disabled?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  /** ISO min date: yyyy-mm-dd (recommended: todayISO()) */
  @Input() minDateISO: string | null = null;

  /** JS weekdays to disable: 0=Sun .. 6=Sat (Friday = 5) */
  @Input() blockedWeekdays: number[] = [5];

  /** Placeholder text */
  @Input() placeholder = 'Select date';

  isOpen = signal(false);

  private _valueISO = signal<string>(''); // yyyy-mm-dd
  valueISO = computed(() => this._valueISO());

  // calendar view state
  private viewYear = signal<number>(new Date().getFullYear());
  private viewMonth = signal<number>(new Date().getMonth()); // 0..11

  // disabled flag from form
  isDisabled = signal(false);

  // ControlValueAccessor callbacks
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ---------- Public API ----------
  open(): void {
    if (this.isDisabled()) return;

    // when opening, sync the calendar view to selected date (or today)
    const base = this.valueISO() ? this.parseISOToLocalDate(this.valueISO()) : new Date();
    this.viewYear.set(base.getFullYear());
    this.viewMonth.set(base.getMonth());

    this.isOpen.set(true);
    queueMicrotask(() => this.onTouched());
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  prevMonth(): void {
    const y = this.viewYear();
    const m = this.viewMonth();
    const d = new Date(y, m - 1, 1);
    this.viewYear.set(d.getFullYear());
    this.viewMonth.set(d.getMonth());
  }

  nextMonth(): void {
    const y = this.viewYear();
    const m = this.viewMonth();
    const d = new Date(y, m + 1, 1);
    this.viewYear.set(d.getFullYear());
    this.viewMonth.set(d.getMonth());
  }

  selectDay(cell: DayCell): void {
    if (cell.kind !== 'day' || !cell.iso || cell.disabled) return;

    this._valueISO.set(cell.iso);
    this.onChange(cell.iso);
    this.close();
  }

  // ---------- Computed rendering ----------
  monthLabel = computed(() => {
    const y = this.viewYear();
    const m = this.viewMonth();
    const d = new Date(y, m, 1);
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  });

  displayValue = computed(() => {
    const iso = this.valueISO();
    if (!iso) return '';
    const d = this.parseISOToLocalDate(iso);
    // clean, professional label
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  grid = computed<DayCell[]>(() => {
    const y = this.viewYear();
    const m = this.viewMonth();

    const first = new Date(y, m, 1);
    const startWeekday = first.getDay(); // 0..6
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const minDate = this.minDateISO ? this.parseISOToLocalDate(this.minDateISO) : null;
    const today = this.startOfDay(new Date());
    const selected = this.valueISO() ? this.parseISOToLocalDate(this.valueISO()) : null;

    const cells: DayCell[] = [];

    for (let i = 0; i < startWeekday; i++) {
      cells.push({ kind: 'blank' });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day);
      const dStart = this.startOfDay(d);

      const iso = this.toISODate(dStart);
      const weekday = dStart.getDay();

      const blocked = this.blockedWeekdays.includes(weekday);
      const beforeMin = minDate ? dStart < this.startOfDay(minDate) : false;

      const disabled = blocked || beforeMin;

      cells.push({
        kind: 'day',
        label: day,
        iso,
        disabled,
        isToday: dStart.getTime() === today.getTime(),
        isSelected: !!selected && dStart.getTime() === this.startOfDay(selected).getTime(),
      });
    }

    return cells;
  });

  weekLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // ---------- CVA ----------
  writeValue(value: string | null): void {
    this._valueISO.set((value ?? '').trim());
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) this.close();
  }

  // ---------- UX helpers ----------
  onBackdrop(): void {
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen()) this.close();
  }

  // ---------- Date helpers ----------
  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private toISODate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private parseISOToLocalDate(iso: string): Date {
    // force local midnight to avoid timezone shifts
    return new Date(`${iso}T00:00:00`);
  }
}
