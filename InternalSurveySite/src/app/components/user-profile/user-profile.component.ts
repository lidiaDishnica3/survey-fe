import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  data: any;
  userFormGroup: FormGroup;
  private changeSub: Subscription;
  notValidPassword = '';

  constructor(
    private SpinnerService: NgxSpinnerService,
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private loc: Location,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private route: Router
  ) { }

  ngOnInit() {
    this.SpinnerService.show();

    this.getCurrentUser();
    this.translateService.use(this.storageService.getStorage('language'));
    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
    this.userFormGroup = this.formBuilder.group({
      Id: [''],
      FirstName: [''],
      LastName: [''],
      Email: [''],
      CurrentPassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[$@$!%*?&]).{8,}$')]],
      NewPassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[$@$!%*?&]).{8,}$')]]
    });
    this.SpinnerService.hide();
  }
  get formControll() { return this.userFormGroup.controls; }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
  getCurrentUser() {


    this.userService.getUser().subscribe(result => {
      this.SpinnerService.show();
      this.data = result;
      this.userFormGroup.patchValue({
        Id: this.data.Id,
        FirstName: this.data.firstName,
        LastName: this.data.lastName,
        Email: this.data.email,
      })
      this.SpinnerService.hide();

    }, error => {
      this.toastr.error(this.translateService.instant('somethingWentWrong'));
      this.SpinnerService.hide();

    });
  }

  changeProfile() {
    if (this.userFormGroup.valid) {
      this.SpinnerService.show();
      this.notValidPassword = '';
      var model = {
        FirstName: this.userFormGroup.get('FirstName').value,
        LastName: this.userFormGroup.get('LastName').value,
        CurrentPassword: this.userFormGroup.get('CurrentPassword').value,
        NewPassword: this.userFormGroup.get('NewPassword').value,
      };
      this.userService.changeProfile(model).subscribe((res: any) => {
        this.toastr.success(this.translateService.instant('successfullyEdited'));
        this.SpinnerService.hide();
        this.route.navigate(['/users-all']);
      }, error => {
        // Check if current password is valid
        if (error?.error == 'CurrentPasswordNotValid') {
          this.notValidPassword = this.translateService.instant('password') + ' ' + this.translateService.instant('notValid') + '!';
          this.toastr.error(this.translateService.instant('password') + ' ' + this.translateService.instant('notValid') + '!');
          this.SpinnerService.hide();
        }
        else {
          this.toastr.error(this.translateService.instant('somethingWentWrong'));
          this.SpinnerService.hide();
        }
      });
    }
    else {
      // this.toastr.error('Invalid form!');
      this.toastr.warning(this.translateService.instant('fillOut'));
    }
  }

  goBack() {
    this.loc.back();
  }

}
