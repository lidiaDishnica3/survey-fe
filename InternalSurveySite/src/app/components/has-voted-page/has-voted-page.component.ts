import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-has-voted-page',
  templateUrl: './has-voted-page.component.html',
  styleUrls: ['./has-voted-page.component.scss']
})
export class HasVotedPageComponent implements OnInit, OnDestroy {

  // #region properties
  hasVoted: boolean;
  surveyHasExpired: boolean;
  private changeSub: Subscription;
  // #endregion

  // #region constructor
  constructor(
    private router: ActivatedRoute,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
  ) {
    this.router.paramMap.subscribe(params => {
      const hasVotedParam = params.get('hasVoted');
      this.setParams(hasVotedParam);
    });
  }
  // #endregion

  // #region onInit onDestroy
  ngOnInit(): void {
    this.translateService.use('en');
    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
  }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
  // #endregion

  // #region methods
  setParams(hasVotedParam): void {
    if (hasVotedParam === 'true') {
      this.hasVoted = true;
      this.surveyHasExpired = false;
    } else {
      this.hasVoted = false;
      this.surveyHasExpired = true;
    }
  }
  // #endregion
}
