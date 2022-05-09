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

  constructor(private translationService: TranslateService) { }
  translate(data: string): string {
    return this.translationService.instant(data);
  }

  initLanguages(lang?: string) {
    const languages = this.getAllLanguages();
    languages.forEach(x => {
      this.translationService.addLangs([x]);
    });


    this.translationService.setDefaultLang(languages[0]);

    const browserLang = this.translationService.getBrowserLang();
    if (!lang) {
      const founded = languages.find(x => x == browserLang);

      this.translationService.use(founded ? (browserLang || languages[0]) : languages[0]);
    } else {
      const language = languages.find(x => x == lang);
      if (language) {
        this.translationService.use(language);
      } else { this.translationService.use(languages[0]); }
    }
  }

  use(lang: string): any {
    this.translationService.use(lang);
  }
  getCurrentLang(): any {
    return this.translationService.currentLang;
  }
  setDefaultLang(lang: string): any {
    this.translationService.setDefaultLang(lang);
  }
  getDefaultLang(): any {
    return this.translationService.getDefaultLang();
  }

  getAllLanguages() {
    return ['en'];
  }
}





