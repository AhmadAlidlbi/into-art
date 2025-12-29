import { Injectable, effect, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'intoart_lang';

  lang = signal<AppLang>(this.readInitialLang());

  constructor(private translate: TranslateService) {
    // Apply immediately + whenever it changes
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
    const saved = (localStorage.getItem(this.storageKey) as AppLang | null);
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  }

  private persist(l: AppLang): void {
    localStorage.setItem(this.storageKey, l);
  }

  private applyDocumentDirection(l: AppLang): void {
    const dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
    document.documentElement.dir = dir;
  }
}
