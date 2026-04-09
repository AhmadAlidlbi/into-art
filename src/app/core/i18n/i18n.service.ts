import { Injectable, effect, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLang = 'en' | 'ar';

export const LANG_STORAGE_KEY = 'intoart_lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  lang = signal<AppLang>(this.readInitialLang());

  constructor(private translate: TranslateService) {
    effect(() => {
      const l = this.lang();
      this.translate.use(l);
      this.persist(l);
      this.applyDocumentDirection(l);
    });
  }

  setLang(l: AppLang): void {
    this.lang.set(l);
  }

  toggle(): void {
    this.lang.set(this.lang() === 'en' ? 'ar' : 'en');
  }

  private readInitialLang(): AppLang {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as AppLang | null;
    return saved === 'ar' || saved === 'en' ? saved : 'ar';
  }

  private persist(l: AppLang): void {
    localStorage.setItem(LANG_STORAGE_KEY, l);
  }

  private applyDocumentDirection(l: AppLang): void {
    const dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
    document.documentElement.dir = dir;
  }
}
