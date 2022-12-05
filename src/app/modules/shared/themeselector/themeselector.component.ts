import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SSubscription } from '../services/SSubscribtion';

@Component({
  selector: 'app-themeselector',
  templateUrl: './themeselector.component.html',
  styleUrls: ['./themeselector.component.scss']
})
export class ThemeSelectorComponent implements OnInit {

  private allSubs = new SSubscription();
  isDarkTheme = false;
  themeName = 'White';
  @Input('showThemeName')
  showThemeName = true;
  constructor(private configService: ConfigService) {

    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isDarkTheme = x == 'dark';
      })

    this.isDarkTheme = this.configService.getTheme() == 'dark';
    this.themeName = this.isDarkTheme ? 'Dark' : 'White';
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {

    this.allSubs.unsubscribe();
  }
  changeTheme(event: MatSlideToggleChange) {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeName = this.isDarkTheme ? 'Dark' : 'White';
    this.configService.saveTheme(this.isDarkTheme ? 'dark' : 'white');
  }

}
