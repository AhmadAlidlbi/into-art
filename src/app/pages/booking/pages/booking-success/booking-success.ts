import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// ─── Same 12h converter used in the booking form ─────────
function to12h(time24: string, lang: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const suffix = h < 12 ? (lang === 'ar' ? 'ص' : 'AM') : lang === 'ar' ? 'م' : 'PM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
}

// ─── Day + month names ────────────────────────────────────
const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];
const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './booking-success.html',
  styleUrls: ['./booking-success.scss'],
})
export class BookingSuccessPage implements OnInit {
  fullName = '';
  displayDate = ''; // e.g. "الاثنين، 14 أبريل 2026" / "Monday, April 14 2026"
  displayTime = ''; // e.g. "10:00 ص" / "10:00 AM"
  hasData = false;

  // Company info
  readonly mapUrl = 'https://maps.app.goo.gl/jL3EFWEWzFdUqvTK9';
  readonly address = {
    ar: 'برج سلك، الدور 23، مكتب 66، شارع جابر المبارك، مدينة الكويت',
    en: 'Silk Tower, Floor 23, Office 66, Jaber Al-Mubarak Street, Kuwait City',
  };

  viewProjectsLink = { path: '/', disabled: true };

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras?.state ?? history.state;

    if (state?.preferredDate && state?.preferredHour) {
      this.hasData = true;
      this.fullName = state.fullName ?? '';
      this.displayTime = to12h(state.preferredHour, this.translate.currentLang ?? 'ar');
      this.displayDate = this.formatDate(state.preferredDate);
    }
  }

  get currentAddress(): string {
    return (this.translate.currentLang ?? 'ar') === 'ar' ? this.address.ar : this.address.en;
  }

  private formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const lang = this.translate.currentLang ?? 'ar';

    if (lang === 'ar') {
      const dayName = DAY_NAMES_AR[date.getDay()];
      const monthName = MONTH_NAMES_AR[date.getMonth()];
      return `${dayName}، ${d} ${monthName} ${y}`;
    } else {
      const dayName = DAY_NAMES_EN[date.getDay()];
      const monthName = MONTH_NAMES_EN[date.getMonth()];
      return `${dayName}, ${monthName} ${d}, ${y}`;
    }
  }
}
