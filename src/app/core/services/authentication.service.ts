import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(private router: Router) {

  }
  get currentSession() {
    return {
      token: ''
    }
  }
  checkSession() {

  }
  logout() {
    this.router.navigateByUrl('/login');
  }
}
