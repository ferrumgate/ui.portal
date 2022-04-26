import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  error(arg0: string) {
    throw new Error('Method not implemented.');
  }
  danger(arg0: string) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
