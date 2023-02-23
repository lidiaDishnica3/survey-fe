import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  public languageChange = new Subject<string>();
  private currentLanguage: string;

  onLanguageChange(language){
    this.currentLanguage = language;
    this.languageChange.next(this.currentLanguage);
  }

}
