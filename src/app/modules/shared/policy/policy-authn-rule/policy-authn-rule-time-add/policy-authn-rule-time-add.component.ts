import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { TimeProfile } from '../../../models/authnProfile';
import { TimeZone } from '../../../models/timezone';
import { SSubscription } from '../../../services/SSubscribtion';
import { ConfigService } from '../../../services/config.service';
import { TranslationService } from '../../../services/translation.service';

export interface TimeProfileExtended extends TimeProfile {

  startTimeStr?: string
  endTimeStr?: string
  daysCount: number;
  timezoneEx: string;

}

@Component({
  selector: 'app-policy-authn-rule-time-add',
  templateUrl: './policy-authn-rule-time-add.component.html',
  styleUrls: ['./policy-authn-rule-time-add.component.scss']
})
export class PolicyAuthnRuleTimeAddComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();
  helpLink = '';

  model: TimeProfileExtended =
    {
      timezone: '', days: [1, 2, 3, 4, 5], daysCount: 5, timezoneEx: '', startTimeStr: '09:00', endTimeStr: '17:00'

    };

  formGroup: FormGroup = this.createFormGroup(this.model);
  formError: { timezone: string, startTime: string, endTime: string, days: string, startTimeLower: string } = { timezone: '', startTime: '', endTime: '', days: '', startTimeLower: '' }

  searchTimeZoneQuery = '';
  selectedTimeZoneQueryChanged: Subject<string> = new Subject<string>();

  isThemeDark = false;
  @Output()
  add = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })

    this.allSub.addThis =
      this.selectedTimeZoneQueryChanged.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe(x => {
        this.searchTimeZoneQuery = x;
        this.searchTimeZone();
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';

  }

  _timezoneList: TimeZone[] = [];
  @Input()
  public set timezoneList(vals: TimeZone[]) {
    this._timezoneList = vals;
    this.prepareAutoCompleteTimeZone();
  }

  public get timezoneList() {
    return this._timezoneList;
  }
  filteredTimeZones: Observable<TimeZone[]> = of();

  ngOnInit(): void {
    this.prepareAutoCompleteTimeZone();
  }
  ngAfterViewInit() {

  }
  ngOnDestroy(): void {

    this.allSub.unsubscribe();
  }

  createFormGroup(zone: TimeProfileExtended) {
    const fmg = new FormGroup({
      timezone: new FormControl(zone.timezoneEx, [Validators.required,]),
      startTime: new FormControl(zone.startTimeStr, [Validators.required]),
      endTime: new FormControl(zone.endTimeStr, [Validators.required,]),
      daysCount: new FormControl(zone.daysCount, [Validators.min(1)]),

    });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;
  }
  //this is not working
  //TODO
  lowerValidator(ctrl: any) {
    const startTime = this.parseTime(this.formGroup?.controls?.startTime?.value)
    const endTime = this.parseTime(this.formGroup?.controls?.endTime?.value);

    if ((startTime || 0) >= (endTime || 0)) {
      return { 'lower': true }
    } return null;
  }

  createFormError() {
    return { timezone: '', startTime: '', endTime: '', days: '', startTimeLower: '' };
  }
  parseTime(data?: string) {
    if (!data) return undefined;
    const hours = Number(data.split(':')[0])
    if (Number.isNaN(hours)) return undefined;
    const minutes = Number(data.split(':')[1]);
    if (Number.isNaN(minutes)) return undefined;
    return hours * 60 + minutes;
  }

  modelChanged() {
    if (this.model.startTimeStr)
      this.model.startTime = this.parseTime(this.model.startTimeStr)
    else
      this.model.startTime = undefined;
    if (this.model.endTimeStr)
      this.model.endTime = this.parseTime(this.model.endTimeStr)
    else
      this.model.startTime = undefined;
    this.checkFormError();

  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();

    const timezoneError = this.formGroup.controls.timezone.errors;
    if (timezoneError) {
      if (timezoneError['required'])
        error.timezone = 'TimeZoneRequired';
      else
        error.timezone = 'TimeZoneInvalid';
    }

    const startTimeError = this.formGroup.controls.startTime.errors;
    if (startTimeError) {
      if (startTimeError['required'])
        error.startTime = 'StartTimeRequired';
      else
        if (startTimeError['lower'])
          error.startTime = 'StartTimeMustBeLower';
        else
          error.startTime = 'StartTimeInvalid';
    }

    const endTimeError = this.formGroup.controls.endTime.errors;
    if (endTimeError) {
      if (endTimeError['required'])
        error.endTime = 'EndTimeRequired';
      else
        error.endTime = 'EndTimeInvalid';
    }

    const daysError = this.formGroup.controls.daysCount.errors;
    if (daysError) {
      if (daysError['required'])
        error.days = 'DaysRequired';
      else
        error.days = 'DaysRequired';
    }

    this.formError = error;

    (this.formGroup as FormGroup).markAllAsTouched();
    this.checkStartTimeLower();

  }

  prepareAutoCompleteTimeZone() {

    this.filteredTimeZones = of(this._timezoneList);
  }

  /// timezone 
  timezoneChanged(event: any) {

    if (event?.option?.value) {

      this.formGroup.controls.timezone.setValue(event.option.value.nameEx);
      this.model.timezone = event.option.value.name;
      //this.model.timezoneEx = event.nameEx;

    } else {

      this.formGroup.controls.timezone.setValue('');
      this.model.timezone = '';
      //this.model.timezoneEx = '';

    }
  }

  selectedTimeZoneChanged(data: any) {
    if (typeof (data) == 'string')
      this.selectedTimeZoneQueryChanged.next(data);

  }
  searchTimeZone() {

    if (!this.searchTimeZoneQuery || this.searchTimeZoneQuery.length < 3)
      this.filteredTimeZones = of(this._timezoneList);
    else {

      this.filteredTimeZones = of(this._timezoneList.filter(x => x.nameEx.toLowerCase().includes(this.searchTimeZoneQuery?.toLowerCase())));
    }
  }

  displayTimeZoneFn(tz: TimeZone | string) {

    if (typeof (tz) == 'string') return tz;
    return tz?.nameEx || '';
  }

  startTimeChanged(data: any) {
    this.formGroup.controls.startTime.setValue(data);
    this.model.startTimeStr = data;

    this.modelChanged();
  }
  endTimeChanged(data: any) {
    this.formGroup.controls.endTime.setValue(data);
    this.model.endTimeStr = data;
    this.modelChanged();
  }

  dayChanged(data: any) {
    const val = Number(data.value);
    if (!Number.isNaN(val)) {
      const index = this.model.days.findIndex(x => x == val)
      if (index < 0)
        this.model.days.push(val);
      else {
        this.model.days.splice(index, 1);
      }
    }
    this.formGroup.controls.daysCount.setValue(this.model.days.length);
    this.modelChanged();

  }
  checkStartTimeLower() {
    if ((this.model.startTime || 0) >= (this.model.endTime || 1440)) {
      this.formError.startTimeLower = 'StartTimeMustBeLower';
      return true;
    }
    else {
      this.formError.startTimeLower = '';
      return false;
    }
  }
  addTimeProfile() {
    this.checkFormError();

    if (this.formGroup.invalid)
      return;
    //invalid data
    if (!this.model.timezone || !this.model.days.length || !this.model.startTime || !this.model.endTime)
      return;

    if (this.checkStartTimeLower()) return;

    this.add.emit(this.model);
  }

}
