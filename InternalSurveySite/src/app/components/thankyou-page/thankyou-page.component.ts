import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.scss']
})
export class ThankyouPageComponent implements OnInit, OnDestroy {
  token: string;
  hasSwitchOff: boolean;
  hasError: boolean;
  iswaitingForData: boolean;
  surveyTitle: string;
  respondentEmail: string;
  private changeSub: Subscription;
  submitMode: any;
  constructor(private surveyService: SurveyService,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private toastr: ToastrService) {
    this.route.paramMap.subscribe(params => {
      this.token = this.route.snapshot.queryParamMap.get('token');
    });
    if (this.token != null) {
      this.iswaitingForData = true;
    }
    else this.iswaitingForData = false;
    
  }

  ngOnInit(): void {
    this.hasError = false;
    this.hasSwitchOff = false;
    if (this.token !== null) {
      this.iswaitingForData = true;
      this.getSwitchOffRespondent();
    }
    else { this.iswaitingForData = false; }
    this.translateService.use('en');

    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });

  }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }

  getSwitchOffRespondent(): void {
    this.SpinnerService.show();
    if (this.token !== null) {
      this.surveyService.getSurveyDataForSwitchOffRespondents(this.token).subscribe((res: any) => {
      this.hasSwitchOff = true;
        this.surveyTitle = res.title;
        this.respondentEmail = res.respondentEmail;
        this.SpinnerService.hide();
        this.iswaitingForData = false; 

      }, error => {
        this.SpinnerService.hide();
          console.log(error);
          this.hasError = true;
          this.iswaitingForData = false; 
        this.toastr.error(this.translateService.instant('invalid'));
      });
    }
    else {
      this.SpinnerService.hide();
    }
  }
}
