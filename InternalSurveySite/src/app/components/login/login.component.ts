import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // #region properties
  loginForm: FormGroup;
  email = '';
  password = '';
  private changeSub: Subscription;
  // #endregion

  // #region constructor
  constructor(
    private SpinnerService: NgxSpinnerService,
    private userService: UserService,
    private storageService: StorageService,
    private route: Router,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translateService: TranslateService,
  ) { }
  // #endregion

  // #region ngOnInit ngOnDestroy
  ngOnInit(): void {
    this.SpinnerService.show();
    // #region translate language
    this.translateService.use('en');
    this.storageService.setStorage('language', 'en');
    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
      this.storageService.setStorage('language', language);
    });
    // #endregion

    if (this.userService.isLoggedIn())
      this.route.navigateByUrl('/dashboard');

    let email = '';
    let password = '';
    this.loginForm = new FormGroup({
      'email': new FormControl(email, [Validators.required]),
      'password': new FormControl(password, [Validators.required]),
    });
    this.SpinnerService.hide();
  }
  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
  // #endregion

  // #region methods
  onLogin() {
    if (this.loginForm.valid) {
      this.SpinnerService.show();
      let formData = this.loginForm.value;
      const data = {
        email: formData.email,
        password: formData.password
      };
      this.userService.postLogin(data).subscribe((res: any) => {
        if (res.token === '')
          this.toastr.error(this.translateService.instant('unauthorized'));

        this.storageService.setAuthToken(res.token);
        this.route.navigateByUrl('/dashboard');
        this.toastr.success(this.translateService.instant('loginSuccess'));
        this.SpinnerService.hide();
      }, error => {
        if (error.status === 400) this.toastr.error(this.translateService.instant('invalidEmailOrPassword'));
        else this.toastr.error(this.translateService.instant('internalError'));
        this.SpinnerService.hide();
      });
    }
    else
      this.toastr.warning(this.translateService.instant('field'));
  }

  keyDownFunction(event) {
    if (event.keyCode === 13)
      this.onLogin();
  }
  // #endregion
}
