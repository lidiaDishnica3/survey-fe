import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit, OnDestroy {

  // #region properties
  registerForm: FormGroup;
  duplicateEmail = '';
  private changeSub: Subscription;
  // #endregion

  // #region constructor
  constructor(
    private SpinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private loc: Location,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private router: Router
  ) { }
  // #endregion

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      Password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[$@$!%*?&]).{8,}$')]],
      ConfirmPassword: ['']
    },
      {
        validator: MustMatch('Password', 'ConfirmPassword')
      }
    );
    this.translateService.use(this.storageService.getStorage('language'));
    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
  }
  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }

  // #region methods
  get formControll() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.valid) {
      this.SpinnerService.show();
      var model = {
        FirstName: this.registerForm.get('FirstName').value,
        LastName: this.registerForm.get('LastName').value,
        Email: this.registerForm.get('Email').value,
        Password: this.registerForm.get('Password').value,
        ConfirmPassword: this.registerForm.get('ConfirmPassword').value
      };
      this.duplicateEmail = '';
      this.userService.registerUser(model)
        .pipe(first())
        .subscribe(
          data => {
            this.toastr.success(this.translateService.instant('successfullyRegistered'));
            this.router.navigateByUrl('/users-all');
            this.SpinnerService.hide();
          },
          error => {
            if (error.status === 400) {
              // Check if survey has expired
              if (error.error == 'DuplicateUserName') this.duplicateEmail = 'Email: ' + this.registerForm.value.Email + ' ' + this.translateService.instant('exists') + '!';
            }
            this.SpinnerService.hide();
          });
    }
    else {
      this.toastr.warning(this.translateService.instant('fillOut'));
    }
  }

  goBack() {
    this.loc.back();
  }
  // #endregion

}

//Metoda per password match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    // return if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors.mustMatch) return;

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) matchingControl.setErrors({ mustMatch: true });
    else matchingControl.setErrors(null);

  }
}
