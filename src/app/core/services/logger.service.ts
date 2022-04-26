import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string) {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  error(msg: string) {

  }
}
