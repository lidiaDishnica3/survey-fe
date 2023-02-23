import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { RespondentService } from 'src/app/services/respondent/respondent.service';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { UserService } from 'src/app/services/user/user.service';
import { ResponseService } from 'src/app/services/response/response.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  modalRef: BsModalRef;
  id: any;
  item: any;
  mode: any = '';
  isdeleted = false;
  isPublished = false;

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private respondentService: RespondentService,
    private surveyService: SurveyService,
    private userService: UserService,
    private translateService: TranslateService,
    private SpinnerService: NgxSpinnerService
    ) { }

  ngOnInit(): void {
  }

  onDeletingItem() {
    if (!this.id) {
      this.errorMessage();
      return;
    }

    switch (this.item) {
      case 'Respondent':
        this.deleteRespondent(this.id);
        break;
      case 'Survey':
        if (this.mode === 'publish'){
          this.SpinnerService.show();
            this.surveyService.getById(this.id).subscribe((data) => {
            this.surveyService.publishSurvey(data).subscribe(() => {
              this.SpinnerService.hide();
              this.isPublished = true;
              this.bsModalRef.hide();
            }
            , error => {
              if (error.error.message == 'EndDateNotValid') this.toastr.error(this.translateService.instant('endDates'));
              else this.toastr.error(this.translateService.instant('invalid'));
              this.SpinnerService.hide();
            });
          });
        } else {
          this.deleteSurvey(this.id);
        }
        break;
      case 'User':
        this.deleteUser(this.id);
        break;
    }
  }

  errorMessage(error?) {
    console.log(error);
    this.bsModalRef.hide();
  }

  deleteRespondent(id){
    this.respondentService.deleteRespondent(id).subscribe((res) => {
      this.toastr.success(this.translateService.instant('toastr.delete'));
    }), error => this.errorMessage(error);
    this.isdeleted = true;
    this.bsModalRef.hide();
  }
    deleteSurvey(id){
      this.surveyService.deleteSurvey(id).subscribe((res) => {
        this.toastr.success(this.translateService.instant('toastr.delete'));
    }), error => this.errorMessage(error);
    this.isdeleted = true;
    this.bsModalRef.hide();
  }
  deleteUser(id) {
    this.userService.deleteUser(id).subscribe((res) => {
        this.toastr.success(this.translateService.instant('toastr.delete'));
    }), error => this.errorMessage(error);
    this.isdeleted = true;
    this.bsModalRef.hide();
  }

}
