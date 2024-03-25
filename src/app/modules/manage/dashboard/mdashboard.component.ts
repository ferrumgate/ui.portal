import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { delay, map, of, switchMap } from 'rxjs';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ChartOptions } from '../../shared/dashboard/chart/dashboard-chart.component';
import { SummaryActive, SummaryAgg, SummaryConfig } from '../../shared/models/summary';
import { ConfirmService } from '../../shared/services/confirm.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SummaryService } from '../../shared/services/summary.service';
import { TranslationService } from '../../shared/services/translation.service';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-mdashboard',
  templateUrl: './mdashboard.component.html',
  styleUrls: ['./mdashboard.component.scss']
})
export class MDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
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
    loginTry: '',
    createdTunnel: '',
    t2faCheck: '',
    userLoginSucess: '',
    userLoginFailed: ''

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

        categories: ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
      },
      dataLabels: {
        style: {
          colors: [this.chartDataLabelColor()]
        }
      }
    } as ChartOptions;

  createTunnelData: ChartOptions =
    {
      title: { text: this.translateService.translate("CreatedTunnel") },
      series: [
        {
          color: this.COLOR_SUCCESS,
          name: "ssh",
          data: [10, 41, 35, 51, 49, 62, 69, 91]
        }
      ],
      chart: {
        foreColor: this.chartForeColor(),
        height: 350,
        type: 'bar'
      },
      xaxis: {

        categories: ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
      },
      dataLabels: {
        style: {
          colors: [this.chartDataLabelColor()]
        }
      }
    } as ChartOptions;

  t2faCheckData: ChartOptions =
    {
      title: { text: this.translateService.translate("2FACheck") },
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

        categories: ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
      },
      dataLabels: {
        style: {
          colors: [this.chartDataLabelColor()]
        }
      }
    } as ChartOptions;

  userLoginSuccess: ChartOptions =
    {
      title: { text: this.translateService.translate("TopUserLoginAllowed") },
      series: [
        {
          color: this.COLOR_SUCCESS,
          name: "Success",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        foreColor: this.chartForeColor(),
        height: 350,
        type: 'bar'
      },
      xaxis: {

        categories: ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
      },
      dataLabels: {
        style: {
          colors: [this.chartDataLabelColor()]
        }
      }
    } as ChartOptions;

  userLoginFailed: ChartOptions =
    {
      title: { text: this.translateService.translate("TopUserLoginFailed") },
      series: [
        {
          color: this.COLOR_FAILED,
          name: "Failed",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        foreColor: this.chartForeColor(),
        height: 350,
        type: 'bar'
      },
      xaxis: {

        categories: ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
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
    this.help.createdTunnel = this.configService.links.summaryCreatedTunnelHelp;
    this.help.t2faCheck = this.configService.links.summary2FACheckHelp;
    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
        this.calculateColors();
      })

  }
  ngOnInit(): void {
    this.getAllData().subscribe();
  }
  ngAfterViewInit(): void {

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
      delay(1000),
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
        this.prepareLoginTry(x);
      }),
      switchMap(x => this.summaryService.get2FACheck()),
      map(x => {
        this.prepare2FACheck(x);
      }),
      switchMap(x => this.summaryService.getCreatedTunnel()),
      map(x => {
        this.prepareCreatedTunnel(x);
      }),
      switchMap(x => this.summaryService.getUserLoginSuccess()),
      map(x => {
        this.prepareUserLoginSuccess(x);
      }),
      switchMap(x => this.summaryService.getUserLoginFailed()),
      map(x => {
        this.prepareUserLoginFailed(x);
      })

    )

  }

  prepareLoginTry(sum: SummaryAgg) {
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
      console.log(ignore);
      //ignored exception
    }
  }

  prepare2FACheck(sum: SummaryAgg) {
    try {
      const dates = sum.aggs.map(x => x.key);

      const data: ChartOptions = {
        title: { text: this.translateService.translate("2FACheck") },
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

      this.t2faCheckData = data;
    } catch (ignore) {
      console.log(ignore);
      //ignored exception
    }
  }

  prepareCreatedTunnel(sum: SummaryAgg) {
    try {
      const dates = sum.aggs.map(x => x.key);

      const data: ChartOptions = {
        title: { text: this.translateService.translate("CreatedTunnel") },
        series: [
          {
            color: this.COLOR_SUCCESS,
            name: "ssh",
            data: sum.aggs.map(x => x.sub?.find(x => x.key == 'ssh')?.value).map(x => x ? x : 0)
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

      this.createTunnelData = data;
    } catch (ignore) {
      console.log(ignore);
      //ignored exception
    }
  }

  prepareUserLoginSuccess(sum: SummaryAgg) {
    try {
      const users = sum.aggs.map(x => x.key);

      const data: ChartOptions = {
        title: { text: this.translateService.translate("TopUserLoginAllowed") },
        series: [
          {
            color: this.COLOR_SUCCESS,
            name: "userLoginSuccess",
            data: sum.aggs.map(x => x.value)
          }
        ],
        chart: {
          foreColor: this.chartForeColor(),
          height: 350,
          type: 'bar'
        },
        xaxis: {

          categories: users
        },
        dataLabels: {
          style: {
            colors: [this.chartDataLabelColor()],

          },
        }
      } as ChartOptions;

      this.userLoginSuccess = data;
    } catch (ignore) {
      console.log(ignore);
      //ignored exception
    }
  }

  prepareUserLoginFailed(sum: SummaryAgg) {
    try {
      const users = sum.aggs.map(x => x.key);

      const data: ChartOptions = {
        title: { text: this.translateService.translate("TopUserLoginFailed") },
        series: [
          {
            color: this.COLOR_FAILED,
            name: "userLoginFailed",
            data: sum.aggs.map(x => x.value)
          }
        ],
        chart: {
          foreColor: this.chartForeColor(),
          height: 350,
          type: 'bar'
        },
        xaxis: {

          categories: users
        },
        dataLabels: {
          style: {
            colors: [this.chartDataLabelColor()],

          },
        }
      } as ChartOptions;

      this.userLoginFailed = data;
    } catch (ignore) {
      console.log(ignore);
      //ignored exception
    }
  }

}
