import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // #region properties
  data: any;
  public selectedLanguage: any;
  public isCollapsed: boolean = false;
  public languageList = [
    { 'id': 1, 'name': 'EN', 'value': 'en' },
    { 'id': 2, 'name': 'SQ', 'value': 'sq' }
  ]
  // #endregion

  // #region constructor
  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }
  // #endregion

  ngOnInit() {
    this.getCurrentUser();
    let language = this.storageService.getStorage('language');
    this.selectedLanguage = this.languageList.find(x => x.value === language).id;
    this.translateService.use(language);
  }

  // #region methods
  getCurrentUser() {
    this.userService.getUser().subscribe(result => {
      this.data = result;
    }, error => {
      console.log('error');
    });
  }

  logout() {
    this.userService.postLogout().subscribe();
    this.storageService.clearALl();
    this.router.navigate(['login']);
  }

  getLanguage(event) {
    if (event) {
      this.translateService.use(event.value);
      this.languageService.onLanguageChange(event.value);
      this.storageService.setStorage('language', event.value);
    }
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }
  // #endregion
}
