import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'intoart_lang';

export function translateLoaderFactory(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) => http.get<Record<string, any>>(`/assets/i18n/${lang}.json`),
  };
}

export function i18nInitFactory(translate: TranslateService) {
  return async () => {
    const saved = (localStorage.getItem(LANG_KEY) as 'en' | 'ar' | null) ?? 'ar';

    translate.setDefaultLang('ar');

    document.documentElement.lang = saved;
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';

    await firstValueFrom(translate.use(saved));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
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