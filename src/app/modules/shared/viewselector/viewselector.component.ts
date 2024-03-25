import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConfigService } from 'src/app/modules/shared/services/config.service';

@Component({
  selector: 'app-viewselector',
  templateUrl: './viewselector.component.html',
  styleUrls: ['./viewselector.component.scss']
})
export class ViewSelectorComponent implements OnInit {

  isDarkTheme = false;
  selection: 'low' | 'high' = 'low';
  @Input()
  selectionMap: { low: string, high: string } = { low: '', high: '' };
  constructor(private configService: ConfigService) {
    this.configService.themeChanged.subscribe(x => {
      this.isDarkTheme = x == 'dark';
    })

    this.isDarkTheme = this.configService.getTheme() == 'dark';
    this.selection = this.configService.getView() == 'low' ? 'low' : 'high';
  }

  ngOnInit(): void {
  }
  changeView(event: MatSlideToggleChange) {
    this.selection = this.selection == 'low' ? "high" : "low";
    this.configService.saveView(this.selection);
  }

}
