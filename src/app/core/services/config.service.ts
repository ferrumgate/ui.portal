import { Injectable, EventEmitter } from '@angular/core';

import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  userId = 'empty';
  constructor(private translationservice: TranslationService) {

  }
  links = {
    documents: 'https://ferrumgate/document',
    support: "https://ferrumgate/support",
    privacy: "https://ferrumgate/privacy",
    about: "https://ferrumgate/about"

  }
  changeUser(userId: string) {
    this.userId = userId;
  }


  init(userId?: string) {
    this.changeUser(userId || 'empty');
    const language = this.getLanguage();
    this.translationservice.initLanguages(language);
    if (language) {
      this.translationservice.setDefaultLang(language);
      this.translationservice.use(language);
    }
    const theme = this.getTheme();
    this.themeChanged.emit(theme);
  }

  getApiUrl(): string {
    return window.location.protocol
      + '//' + window.location.hostname
      // tslint:disable-next-line: triple-equals
      + (window.location.port != '' ? (':' + window.location.port) : '') + '/api';
  }


  langChanged: EventEmitter<string> = new EventEmitter();

  saveLanguage(lang: string) {

    localStorage.setItem(`language_for_user_${this.userId}`, lang);
    this.translationservice.setDefaultLang(lang);
    this.translationservice.use(lang);
    this.langChanged.emit('lang');
  }
  getLanguage(): string | undefined {
    const language = localStorage.getItem(`language_for_user_${this.userId}`);
    return language || undefined;
  }

  // theme functions

  themeChanged: EventEmitter<string> = new EventEmitter();
  saveTheme(theme: string) {

    localStorage.setItem(`theme_for_user_${this.userId}`, theme);

    this.themeChanged.emit(theme);
  }
  getTheme() {
    const theme = localStorage.getItem(`theme_for_user_${this.userId}`);
    return theme || 'white';
  }
}
