import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodyService {

  _appTheme = new BehaviorSubject<{theme: string}>({
    theme: ''
  })

  constructor() { }
  get appTheme(): {theme: string}
  {
    return this._appTheme.value;
  }
  set appTheme(theme: {theme: string})
  {
    this._appTheme.next(theme);
  }
}
