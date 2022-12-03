import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from 'src/app/modules/shared/models/group';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { TranslationService } from '../../shared/services/translation.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmService } from '../../shared/services/confirm.service';
import { debounceTime, of, distinctUntilChanged, map, switchMap, takeWhile } from 'rxjs';
import { UtilService } from '../../shared/services/util.service';
import { Service } from '../../shared/models/service';
import { Network } from '../../shared/models/network';
import { NetworkService } from '../../shared/services/network.service';
import { ServiceService } from '../../shared/services/service.service';
import { SummaryService } from '../../shared/services/summary.service';
import { SummaryActive, SummaryAgg, SummaryConfig } from '../../shared/models/summary';
import { ChartOptions } from '../../shared/dashboard/chart/dashboard-chart.component';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-mdashboard',
  templateUrl: './mdashboard.component.html',
  styleUrls: ['./mdashboard.component.scss']
})
export class MDashboardComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();

  isThemeDark = false;
  @ViewChild('loginTryChart') loginTryChart!: ChartComponent;

  help = {
    network: '',
    gateway: '',
    user: '',
    service: '',
    group: '',
    policyAuthn: '',
    policyAuthz: '',
    session: '',
    tunnel: '',
    loginTry: ''

  }

  config: SummaryConfig = {
    networkCount: 0,
    gatewayCount: 0,
    userCount: 0,
    groupCount: 0,
    serviceCount: 0,
    authnCount: 0,
    authzCount: 0,

  }
  active: SummaryActive = {
    sessionCount: 0,
    tunnelCount: 0
  }

  COLOR_SUCCESS = '#006814';
  COLOR_FAILED = '#C70039';
  chartForeColor() {
    return this.isThemeDark ? '#bfbfbf' : '#000';
  }
  chartDataLabelColor() {
    return this.isThemeDark ? '#d1d1d1' : '#1e1e1e';
  }


  loginTryData: ChartOptions =
    {
      title: { text: this.translateService.translate("LoginTry") },
      series: [
        {
          color: this.COLOR_SUCCESS,
          name: "Success",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        },
        {
          color: this.COLOR_FAILED,
          name: "Failed",
          data: [15, 45, 5, 1, 49, 62, 69, 91, 48]
        }
      ],
      chart: {
        foreColor: this.chartForeColor(),
        height: 350,
        type: 'bar'
      },
      xaxis: {

        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      dataLabels: {
        style: {
          colors: [this.chartDataLabelColor()]
        }
      }
    } as ChartOptions;



  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private summaryService: SummaryService
  ) {



    this.isThemeDark = this.configService.getTheme() == 'dark';
    this.help.network = this.configService.links.networkHelp;
    this.help.gateway = this.configService.links.gatewayHelp;
    this.help.user = this.configService.links.accountUserHelp;
    this.help.group = this.configService.links.accountGroupHelp;
    this.help.policyAuthn = this.configService.links.policyAuthnHelp;
    this.help.policyAuthz = this.configService.links.policyAuthzHelp;
    this.help.session = this.configService.links.sessionHelp;
    this.help.tunnel = this.configService.links.tunnelHelp;
    this.help.service = this.configService.links.serviceHelp;
    this.help.loginTry = this.configService.links.summaryLoginTryHelp;
    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
        this.calculateColors();
      })


  }
  ngOnInit(): void {

    this.getAllData().subscribe();

  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }
  calculateColors() {
    this.loginTryChart?.updateOptions({
      chart: {
        foreColor: this.chartForeColor()
      },
      dataLabels: {
        style: {
          colors: [this.chartDataLabelColor()]
        }
      }
    }, false)
  }


  getAllData() {
    return of('').pipe(
      switchMap(x => this.summaryService.getConfig()),
      map(x => {
        this.config = x
      }),
      switchMap(x => this.summaryService.getActive()),
      map(x => {
        this.active = x;
      }),
      switchMap(x => this.summaryService.getLoginTry()),
      map(x => {
        this.prepareTryLogin(x);
      })

    )

  }

  prepareTryLogin(sum: SummaryAgg) {
    try {
      const dates = sum.aggs.map(x => x.key);

      const data: ChartOptions = {
        title: { text: this.translateService.translate("LoginTry") },
        series: [
          {
            color: this.COLOR_SUCCESS,
            name: this.translateService.translate("Success"),
            data: sum.aggs.map(x => x.sub?.find(x => x.key == '200')?.value).map(x => x ? x : 0)
          },
          {
            color: this.COLOR_FAILED,
            name: this.translateService.translate("Failed"),
            data: sum.aggs.map(x => x.sub?.find(x => x.key != '200')?.value).map(x => x ? x : 0)
          }
        ],
        chart: {
          foreColor: this.chartForeColor(),
          height: 350,
          type: 'bar'
        },
        xaxis: {

          categories: dates.map(x => UtilService.dateFormatDD(Number(x)))
        },
        dataLabels: {
          style: {
            colors: [this.chartDataLabelColor()],

          },
        }
      } as ChartOptions;

      this.loginTryData = data;
    } catch (ignore) {
      //ignored exception
    }
  }




}
