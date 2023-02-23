import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-public-navbar',
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.scss']
})
export class PublicNavbarComponent implements OnInit {

  public languageList = [
    {'id': 1, 'name': 'EN', 'value': 'en'},
    {'id': 2, 'name': 'SQ', 'value': 'sq'}
  ]

  public selectedLanguage: any;

  constructor(
    private storageService: StorageService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.languageList.find(x => x.value === 'en').id;
    this.translateService.use('en');
  }

  getLanguage(event){
    if (event){
      this.translateService.use(event.value);
      this.languageService.onLanguageChange(event.value);
    }
  }

}
