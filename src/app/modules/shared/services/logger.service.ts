import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  error(msg: any) {
    if (msg instanceof Object)
      console.log(`debug: ${JSON.stringify(msg)}`);
    else
      console.log(`debug: ${msg}`);
  }
  debug(msg: any) {
    if (!environment.production)
      if (msg instanceof Object)
        console.log(`debug: ${JSON.stringify(msg)}`);
      else
        console.log(`debug: ${msg}`);
  }
  log(msg: any) {
    if (msg instanceof Object)
      console.log(`debug: ${JSON.stringify(msg)}`);
    else
      console.log(`debug: ${msg}`);
  }

}
