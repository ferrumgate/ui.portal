import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-languageselector',
  templateUrl: './languageselector.component.html',
  styleUrls: ['./languageselector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  items: { name: string, value: string }[] = [];
  selected: string;
  constructor(private translationService: TranslationService, private configService: ConfigService) {

    this.items = this.translationService.getAllLanguages().map(x => { return { name: x, value: x }; })
    this.selected = this.translationService.getCurrentLang();
  }

  ngOnInit(): void {
  }
  changeLanguage(event: any) {
    this.configService.saveLanguage(event.value);
  }

}
