import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

// ✅ No TranslateHttpLoader (avoids your TS2554 constructor mismatch)
// Loads: /assets/i18n/en.json , /assets/i18n/ar.json
export function translateLoaderFactory(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) =>
      http.get<Record<string, any>>(`/assets/i18n/${lang}.json`),
  };
}

// ✅ Force language + load translations BEFORE app renders
export function i18nInitFactory(translate: TranslateService) {
  return async () => {
    const saved = (localStorage.getItem('lang') as 'en' | 'ar' | null) ?? 'en';

    translate.setDefaultLang('en');

    // important: set dir/lang early for layout correctness
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';

    // wait for translation file to be loaded
    await firstValueFrom(translate.use(saved));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: i18nInitFactory,
      deps: [TranslateService],
      multi: true,
    },
  ],
};
