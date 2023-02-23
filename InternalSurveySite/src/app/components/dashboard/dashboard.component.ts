import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { SurveyQuestionOptionsService } from 'src/app/services/surveyquestionoptions/surveyquestionoptions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  surveyList: any;
  DashboardGroup: FormGroup;
  questionId: any;
  graphLabels: Array<string> = [];
  graphData: Array<number> = [];
  showInfo: boolean = true;
  graphLabels2: Array<string> = [];
  graphData2: Array<number> = [];
  questionDropdown = [];
  id: any;
  public barChartLabels: Label[] = [''];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];

  public barChartData2: ChartDataSets[] = [
    { data: [], label: '' },
 ];

 public barChartOptions: ChartOptions = {
  legend: {
    display: true
  },
  tooltips: {
    enabled: true
  },
  scales: {
    yAxes: [{
        ticks: {
            beginAtZero: true
        }
    }]
},
  responsive: true,
  plugins: {
    datalabels: {
      anchor: 'end',
      align: 'end',
    }
  }
};

public selectedQuestionId;
public selectedSurveyId;

public barChartOptions2: ChartOptions = {
  legend: {
    display: true
  },
  tooltips: {
    enabled: true
  },
  scales: {
    yAxes: [{
        ticks: {
            beginAtZero: true
        }
    }]
},
  responsive: true,
  plugins: {
    datalabels: {
      anchor: 'end',
      align: 'end',
    }
  }
};
public barChartLabels2: Label[] = [''];
public barChartType2: ChartType = 'bar';
public barChartLegend2 = true;
public barChartPlugins2 = [];

public imgSrcArray = [];
public imgWidth: number = 0;

private changeSub: Subscription;

  constructor(
    private _surveyService: SurveyService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private surveyQuestionOptionsServiceService: SurveyQuestionOptionsService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private spinnerService: NgxSpinnerService
    ) {

      this.translateService.stream('respondentsPerSurvey').subscribe((translated: string) => {
        let barChartData: ChartDataSets[] = [
          { data: this.graphData, label: translated },
        ];
        this.barChartData = barChartData;
      });

      this.translateService.stream('responsesPerQuestion').subscribe((translated: string) => {
        let barChartData: ChartDataSets[] = [
          { data: this.graphData2, label: translated },
        ];
        this.barChartData2 = barChartData;
      });

    }

  ngOnInit() {
    this.GetAllSurveys();

    this.DashboardGroup = this.formBuilder.group({
      Survey: new FormControl(this.selectedSurveyId),
      Question: new FormControl(this.questionId)
    });

    this.translateService.use(this.storageService.getStorage('language'));

    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
  }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }

  GetAllSurveys() {
    this.spinnerService.show();
    this._surveyService.getAllPublished().subscribe(result => {
      this.surveyList = result.body;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
      this.toastr.error(error);
    });
  }

  getAllData() {
    this.spinnerService.show();
    // clear Images Div content
    this.imgSrcArray = [];

    this._surveyService.getResponsesFromQuestion(this.selectedSurveyId).subscribe(res => {
      // Question responses for a survey
      if (res == 0) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }

      let barChartOptionsTemp: ChartOptions = {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true,
                  max: res.respondents
              }
          }]
        }
      };

      this.barChartOptions = barChartOptionsTemp;

      this.graphData = [];
      this.graphLabels = [];

      this.graphLabels.push(res.surveyTitle);
      this.graphData.push(parseInt(res.surveyRespondents));

      this.barChartLabels = this.graphLabels;
      this.barChartData = [{ data: this.graphData } ];

      this.barChartData[0].label = this.translateService.instant('respondentsPerSurvey');


      // Question responses for a survey
      if (res.questions[0].totalVoters == 0) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }

      let barChartOptionsTemp2: ChartOptions = {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true,
              }
          }]
        }
      };

      this.barChartOptions2 = barChartOptionsTemp2;

      this.graphData2 = [];
      this.graphLabels2 = [];

      this.questionDropdown = res.questions;

      for (let i = 0; i < this.questionDropdown.length; i++) {
        this.graphLabels2.push(this.questionDropdown[i].questionTitle);
        this.graphData2.push(this.questionDropdown[i].totalVoters);
      }

      this.barChartLabels2 = this.graphLabels2;
      this.barChartData2 = [{ data: this.graphData2 } ];

      this.barChartData2[0].label = this.translateService.instant('responsesPerQuestion');

      this.spinnerService.hide();
    }),
    error => {
      this.spinnerService.hide();
      this.toastr.error(this.translateService.instant('toastr.somethingWrong'));
    };

    this.spinnerService.hide();
  }

  getRespondentsPerQuestion() {
    this.spinnerService.show();

    // clear Images Div content
    this.imgSrcArray = [];

    if (this.selectedQuestionId) {
      let questionOptions = this.questionDropdown.find(i => i.questionId == this.selectedQuestionId);
      let options = questionOptions.options;

      if (questionOptions.totalVoters == 0) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }

      let barChartOptionsTemp: ChartOptions = {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true,
                  max: questionOptions.totalVoters
              }
          }]
        }
      };

      this.barChartOptions2 = barChartOptionsTemp;

      this.graphData2 = [];
      this.graphLabels2 = [];

      for (let i = 0; i < options.length; i++) {
        if (questionOptions.questionType === 3) { // images
          this.graphLabels2.push('');
          this.imgWidth = 100 / options.length;
          this.surveyQuestionOptionsServiceService.getImage(options[i].optionId).subscribe(res => {
            this.imgSrcArray.push({optionId: options[i].optionId, option: res.option});
            if (this.imgSrcArray.length == options.length){
              this.imgSrcArray.sort((a, b) => {
                return a.optionId - b.optionId;
              });
            }
          }),
          error => {
            this.spinnerService.hide();
            this.toastr.error(this.translateService.instant('toastr.somethingWrong'));
          };
        }
        else if (questionOptions.questionType === 4) { // number
          var keys: Array<any> = Object.keys(options[i].responses);
          var values: Array<any> = Object.values(options[i].responses);
          let index = 0;

          for (let j = 0; j <= options[i].option; j++){
            this.graphLabels2.push('' + j);
            if (keys.includes(j.toString())) {
              this.graphData2.push(values[index]);
              index++;
            }
            else{
              this.graphData2.push(0);
            }
          }
        }
        else if (questionOptions.questionType === 5) { // text
          this.graphLabels2.push('Other text (answer provided by respondent)');
        }
        else if (questionOptions.hasOthers === true && options[i].option === 'hasOtherOption2929'){
          this.graphLabels2.push('Other');
        }
        else {
          this.graphLabels2.push(options[i].option);
        }

        this.graphData2.push(options[i].optionVoters);
      }

      this.barChartLabels2 = this.graphLabels2;
      this.barChartData2 = [{ data: this.graphData2 }];

      this.barChartData2[0].label = this.translateService.instant('responsesPerQuestion');
    }

    this.spinnerService.hide();
  }

  get Survey() { return this.DashboardGroup.get('Survey'); }
  get Question() { return this.DashboardGroup.get('Question'); }
}
