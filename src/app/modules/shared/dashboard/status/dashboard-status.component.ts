import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SSubscription } from '../../services/SSubscribtion';
import { ConfigService } from '../../services/config.service';
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
