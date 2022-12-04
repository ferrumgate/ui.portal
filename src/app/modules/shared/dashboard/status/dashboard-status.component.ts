import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

import { map, Observable, of } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { SSubscription } from '../../services/SSubscribtion';
import { TranslationService } from '../../services/translation.service';





@Component({
  selector: 'app-dashboard-status',
  templateUrl: './dashboard-status.component.html',
  styleUrls: ['./dashboard-status.component.scss']
})
export class DashboardStatusComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();

  isThemeDark = false;
  @Input()
  toolTip = '';
  @Input()
  title = '';
  @Input()
  helpLink = '';
  @Input()
  icon = 'link'
  @Input()
  detail = ''
  @Input()
  count = '0';
  isSvg = false;
  @Input()
  set isSVG(val: string) {
    this.isSvg = val == 'true';
  }

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslationService,
    private configService: ConfigService
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.serviceHelp;
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }


}
