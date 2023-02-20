import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceBWItem } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';



interface BaseModel extends IpIntelligenceBWItem {

}
interface Model extends BaseModel {

}

@Component({
  selector: 'app-config-ip-intelligence-bwlist-item',
  templateUrl: './config-ip-intelligence-bwlist-item.component.html',
  styleUrls: ['./config-ip-intelligence-bwlist-item.component.scss']
})
export class ConfigIpIntelligenceBWListItemComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();

  isExpanded = false;

  isThemeDark = false;
  @Input()
  isBlackList: Boolean = false;


  @Input()
  model: IpIntelligenceBWItem = { id: '', val: '', insertDate: '', description: '' }

  get insertDate() {
    return UtilService.dateFormatToLocale(this.model.insertDate ? new Date(this.model.insertDate) : new Date());
  }



  @Output()
  deleteItem = new EventEmitter();



  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {


    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

  }



  ngOnInit(): void {


  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }
  delete() {
    this.deleteItem.emit(this.model);
  }



}
