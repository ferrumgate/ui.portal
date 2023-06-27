import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable, of, Subscription, switchMap } from 'rxjs';
import { Group } from '../models/group';
import { ConfigService } from '../services/config.service';
import { InputService } from '../services/input.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';



@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  @Input()
  requiredFileType: string = 'txt';

  @Input()
  name: string = 'file'

  @Input()
  isDelete: boolean = false;

  file: File | null = null;
  @Input()
  uploadProgress: number;
  @Input()
  filename: string = '';
  @Output()
  onFileSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  onFileDeletedEvent: EventEmitter<any> = new EventEmitter();

  isThemeDark = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    this.uploadProgress = 0;


  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.onFileSelectedEvent.emit(file);
    }
  }

  cancelUpload() {

    this.reset();
  }

  reset() {
    this.file = null;
    this.uploadProgress = 0;

  }
  deleteFile() {
    this.file = null;
    this.uploadProgress = 0;
    this.onFileDeletedEvent.emit();
  }


}
