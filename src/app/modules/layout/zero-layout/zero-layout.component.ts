import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-zero-layout',
  templateUrl: './zero-layout.component.html',
  styleUrls: ['./zero-layout.component.scss']
})
export class ZeroLayoutComponent implements OnInit {
  showLanguages = false;
  constructor(private translator: TranslationService) {
    this.showLanguages = this.translator.getAllLanguages().length > 1;
  }
  ngOnInit(): void {

  }

}
