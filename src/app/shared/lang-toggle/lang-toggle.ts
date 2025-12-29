import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <button class="lang" type="button" (click)="i18n.toggle()">
      <span class="label">{{ 'common.language' | translate }}</span>
      <span class="pill">{{ i18n.lang() === 'en' ? ('common.english' | translate) : ('common.arabic' | translate) }}</span>
    </button>
  `,
  styles: [`
    .lang{
      border: 1px solid rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.90);
      border-radius: 14px;
      padding: 10px 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-weight: 850;
    }
    .label{ opacity: 0.8; font-weight: 900; font-size: 12px; }
    .pill{
      background: rgba(0,0,0,0.06);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 900;
    }
  `],
})
export class LanguageToggleComponent {
  i18n = inject(I18nService);
}
