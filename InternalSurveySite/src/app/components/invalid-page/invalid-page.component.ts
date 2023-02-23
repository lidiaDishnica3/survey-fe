import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invalid-page',
  templateUrl: './invalid-page.component.html',
  styleUrls: ['./invalid-page.component.scss']
})
export class InvalidPageComponent implements OnInit, OnDestroy {
  private changeSub: Subscription;

  constructor(private surveyService: SurveyService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private toastr: ToastrService) {
  
  }

  ngOnInit(): void {

    this.translateService.use('en');

    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
  }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
}
