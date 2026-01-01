import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

export function translateLoaderFactory(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) =>
      http.get<Record<string, any>>(`/assets/i18n/${lang}.json`),
  };
}

export function i18nInitFactory(translate: TranslateService) {
  return async () => {
    // ✅ default is AR if nothing saved
    const saved = (localStorage.getItem('lang') as 'en' | 'ar' | null) ?? 'ar';

    // ✅ default language becomes AR
    translate.setDefaultLang('ar');

    // ✅ set direction/lang before render
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';

    // ✅ load translations before app renders
    await firstValueFrom(translate.use(saved));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    importProvidersFrom(
      TranslateModule.forRoot({
        // ✅ default becomes AR
        defaultLanguage: 'ar',
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
