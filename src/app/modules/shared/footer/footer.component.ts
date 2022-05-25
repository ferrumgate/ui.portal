import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/modules/shared/services/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  aboutLink: string;
  privacyLink: string;
  documentsLink: string;
  supportLink: string;

  constructor(private configService: ConfigService) {
    this.aboutLink = configService.links.about;
    this.privacyLink = configService.links.privacy;
    this.documentsLink = configService.links.documents;
    this.supportLink = configService.links.support;
  }

  ngOnInit(): void {
  }

}
