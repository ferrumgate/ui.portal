import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function translationHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private translateService: TranslateService) { }
  translate(data: string): string {
    return this.translateService.instant(data);
  }

  initLanguages(lang?: string) {
    const languages = this.getAllLanguages();
    languages.forEach(x => {
      this.translateService.addLangs([x]);
    });


    this.translateService.setDefaultLang(languages[0]);

    const browserLang = this.translateService.getBrowserLang();
    if (!lang) {
      const founded = languages.find(x => x == browserLang);

      this.translateService.use(founded ? (browserLang || languages[0]) : languages[0]);
    } else {
      const language = languages.find(x => x == lang);
      if (language) {
        this.translateService.use(language);
      } else { this.translateService.use(languages[0]); }
    }
  }

  use(lang: string): any {
    this.translateService.use(lang);
  }
  getCurrentLang(): any {
    return this.translateService.currentLang;
  }
  setDefaultLang(lang: string): any {
    this.translateService.setDefaultLang(lang);
  }
  getDefaultLang(): any {
    return this.translateService.getDefaultLang();
  }

  getAllLanguages() {
    return ['en', 'en'];
  }
}





