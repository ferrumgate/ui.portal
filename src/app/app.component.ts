import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { LoggerService } from './core/services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  /**
   *
   */
  constructor(private router: Router, private loggerService: LoggerService, private authenticationService: AuthenticationService) {
    this.authenticationService.checkSession();
  }
  ngOnInit(): void {
    this.router.navigateByUrl('/login');
  }

}
