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
      token: '',
      currentUser: {
        id: '0'
      }
    }
  }
  checkSession() {

  }
  logout() {
    this.router.navigateByUrl('/login');
  }
}
