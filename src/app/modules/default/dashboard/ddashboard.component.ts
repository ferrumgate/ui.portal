import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { debounceTime, of, distinctUntilChanged, map, switchMap, takeWhile, delay } from 'rxjs';
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
  selector: 'app-ddashboard',
  templateUrl: './ddashboard.component.html',
  styleUrls: ['./ddashboard.component.scss']
})
export class DDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private allSubs = new SSubscription();

  isThemeDark = false;
  @ViewChild('loginTryChart') loginTryChart!: ChartComponent;

  help = {
    userLoginTry: '',
    userLoginTryHours: '',
  }



  COLOR_SUCCESS = '#006814';
  COLOR_FAILED = '#C70039';
  chartForeColor() {
    return this.isThemeDark ? '#bfbfbf' : '#000';
  }
  chartDataLabelColor() {
    return this.isThemeDark ? '#d1d1d1' : '#1e1e1e';
  }


  userLoginTryData: ChartOptions =
    {
      title: { text: this.translateService.translate("UserLoginTry") },
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


  userLoginTryHoursData: ChartOptions =
    {
      title: { text: this.translateService.translate("UserLoginTryHours") },
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
        width: 500,
        type: 'bar'
      },
      xaxis: {

        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
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
    this.help.userLoginTry = this.configService.links.summaryLoginTryHelp
    this.help.userLoginTryHours = this.configService.links.summaryUserLoginTryHoursHelp;
    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
        this.calculateColors();
      })


  }
  ngOnInit(): void {

    this.getAllData().subscribe();

  }
  ngAfterViewInit() {

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
      switchMap(x => this.summaryService.getUserLoginTry()),
      map(x => {
        this.prepareUserLoginTry(x);
      }),
      switchMap(x => this.summaryService.getUserLoginTryHours()),
      map(x => {
        this.prepareUserLoginTryHours(x);
      })

    )

  }

  prepareUserLoginTry(sum: SummaryAgg) {
    try {
      const dates = sum.aggs.map(x => x.key);

      const data: ChartOptions = {
        title: { text: this.translateService.translate("UserLoginTry") },
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

      this.userLoginTryData = data;
    } catch (ignore) {
      console.log(ignore);
      //ignored exception
    }
  }


  prepareUserLoginTryHours(sum: SummaryAgg) {
    try {

      const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      const map = new Map<number, any>();
      sum.aggs.forEach(x => {

        const hour = new Date(x.key).getHours();
        const valueSuccess = x.sub?.filter(y => y.key == '200').map(a => a.value).reduce((x, y) => x + y, 0) || 0;
        const valueFailed = x.sub?.filter(y => y.key != '200').map(a => a.value).reduce((x, y) => x + y, 0) || 0;
        if (!map.has(hour))
          map.set(hour, { success: 0, failed: 0 });
        map.get(hour).failed += valueFailed;
        map.get(hour).success += valueSuccess;


      })



      const data: ChartOptions = {
        title: { text: this.translateService.translate("UserLoginTryHours") },
        series: [
          {
            color: this.COLOR_SUCCESS,
            name: this.translateService.translate("Success"),
            data: hours.map(x => {
              if (!map.has(x)) return 0;
              return map.get(x).success
            })
          },
          {
            color: this.COLOR_FAILED,
            name: this.translateService.translate("Failed"),
            data: hours.map(x => {
              if (!map.has(x)) return 0;
              return map.get(x).failed
            })
          }
        ],
        chart: {
          foreColor: this.chartForeColor(),
          height: 350,
          width: 500,
          type: 'bar'
        },
        xaxis: {

          categories: hours.map(x => { return x < 10 ? '0' + x : x })
        },
        dataLabels: {
          style: {
            colors: [this.chartDataLabelColor()],

          },
        }
      } as ChartOptions;

      this.userLoginTryHoursData = data;
    } catch (ignore) {
      console.log(ignore);
      //ignored exception
    }
  }





}
