import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { take } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { PaginationModel } from '../shared/PaginationModel';
import { Pagination } from '../shared/Pagination';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, OnDestroy {

  // #region properties
  public surveys: any;
  showNew: Boolean = false;
  submitType: string = 'Save';
  selectedRow: number;
  editMode = false;
  public modalRef: BsModalRef;

  public columns = [
    { title: 'Title', name: 'title' },
    { title: 'Description', name: 'description' },
    { title: 'Start Date', name: 'startDate', property: 'date' },
    { title: 'End Date', name: 'endDate', property: 'date' },
    { title: 'Actions', property: 'actions' }
  ];
  public columnsSq = [
    { title: 'Titulli', name: 'title' },
    { title: 'Përshkrimi', name: 'description' },
    { title: 'Data e fillimit', name: 'startDate', property: 'date' },
    { title: 'Data e përfundimit', name: 'endDate', property: 'date' },
    { title: 'Veprimet', property: 'actions' }
  ];

  private changeSub: Subscription;
  surveyForm: FormGroup;
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 1, PageSize: 10 };
  // #endregion

  // #region constructor
  constructor(private surveysService: SurveyService,
    private route: Router,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService

  ) { }
  // #endregion

  ngOnInit(): void {
    this.surveyForm = new FormGroup({
      'title': new FormControl(null),
      'description': new FormControl(null),
      'startDate': new FormControl(null),
      'endDate': new FormControl(null),
    });
    this.getAll();
    this.translateService.use(this.storageService.getStorage('language'));
    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
  }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }

  // #region methods
  onPaginationValuesChange(values: PaginationModel) {
    this.paginationModel = values;
    this.getAll();
  }

  getAll() {
    let pagination = new Pagination(this.paginationModel);
    this.SpinnerService.show();
    this.surveysService.getAll(pagination).subscribe((surveys: any) => {
      this.setPagination = surveys;
      this.surveys = surveys.body;
      this.SpinnerService.hide();
    }, error => {
        this.toastr.error('Something went wrong!');
        this.SpinnerService.hide();
    });
  }

  onDelete(id) {
    const config: ModalOptions = {
      initialState: {
        id: id,
        item: 'Survey'
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, config);
    this.modalRef.setClass('modal-dialog-centered');
    this.modalService.onHide
      .pipe(take(1))
      .subscribe(() => {
        if (this.modalRef.content.isdeleted) this.getAll();
      }, error => {
        this.toastr.error('Something went wrong!');
      });

  }

  onPublish(id) {
    console.log("publish survey id : ", id);

    const config: ModalOptions = {
      initialState: {
        id: id,
        item: 'Survey',
        mode: 'publish'
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, config);
    this.modalRef.setClass('modal-dialog-centered');
    this.modalService.onHide
      .pipe(take(1))
      .subscribe(() => {
        if (this.modalRef.content.isPublished) {
          this.getAll();
        }
      }, error => {
        this.toastr.error('Something went wrong!');
      });
  }

  onNew() {
    this.route.navigate(['/createsurvey']);
  }

  onEdit(id) {
    this.editMode = true;
    this.route.navigate(['/createsurvey', id, this.editMode]);
  }

  onCancel() {
    this.showNew = false;
  }

  actionEvent(event: any) {
    switch (event.action) {
      case 'delete':
        this.onDelete(event.id);
        break;
      case 'edit':
        this.onEdit(event.id);
        break;
      case 'publish':
        this.onPublish(event.id);
        break;
    }
  }

  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }
  // #endregion

}
