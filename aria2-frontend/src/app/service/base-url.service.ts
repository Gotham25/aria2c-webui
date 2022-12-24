
import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseURLService {

  constructor(
    @Inject(Window) private injectedWindow: Window
  ) { }

  getBaseURL(): string {
    const location = this.injectedWindow.location;
    const protocol = location.protocol.replace(':', '');
    const hostName = location.hostname;
    const port = location.port;
    let baseURL = `${protocol}://${hostName}`;
    if(port !== '') {
      baseURL = `${baseURL}:${port}`;
    }
    return baseURL;
  }
}
