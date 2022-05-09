import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-themeselector',
  templateUrl: './themeselector.component.html',
  styleUrls: ['./themeselector.component.scss']
})
export class ThemeSelectorComponent implements OnInit {

  isDarkTheme = false;
  themeName = 'White';

  constructor(private configService: ConfigService) {
    this.configService.themeChanged.subscribe(x => {
      this.isDarkTheme = x == 'dark';
    })

    this.isDarkTheme = this.configService.getTheme() == 'dark';
    this.themeName = this.isDarkTheme ? 'White' : 'Dark';
  }

  ngOnInit(): void {
  }
  changeTheme(event: MatSlideToggleChange) {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeName = this.isDarkTheme ? 'White' : 'Dark';
    this.configService.saveTheme(this.isDarkTheme ? 'dark' : 'white');
  }

}
