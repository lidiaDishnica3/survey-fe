import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LanguageService } from 'src/app/services/language/language.service';
import { RespondentService } from 'src/app/services/respondent/respondent.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { Pagination } from '../shared/Pagination';
import { PaginationModel } from '../shared/PaginationModel';

@Component({
  selector: 'app-respondent',
  templateUrl: './respondent.component.html',
  styleUrls: ['./respondent.component.scss']
})
export class RespondentComponent implements OnInit, OnDestroy {

  public data: any;
  public email: any;

  public columns = [
    { title: 'Email', name: 'email' },
    { title: 'Actions', property: 'actions'}
  ];

  public columnsSq = [
    { title: 'Email', name: 'email' },
    { title: 'Veprimet', property: 'actions'}
  ];

  public modalRef: BsModalRef;

  public action = '';

  responseForm: FormGroup;

  @ViewChild('closeBtn') closeBtn: ElementRef;

  private changeSub: Subscription;

  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 1, PageSize: 10 };
  onPaginationValuesChange(values: PaginationModel) {
    this.paginationModel = values;
    this.loadData();
  }

  constructor(
    private respondentService: RespondentService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private spinnerService: NgxSpinnerService) {}

  ngOnInit(): void {
    this.responseForm = new FormGroup({
      'id': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    });

    this.loadData();

    this.translateService.use(this.storageService.getStorage('language'));

    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);
    });
  }

  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }

  public getData(row: any, propertyName: string): string {
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  loadData() {
    this.spinnerService.show();
    let pagination = new Pagination(this.paginationModel);
    this.respondentService.getAll(pagination).subscribe((res: any) => {
      this.setPagination = res;
      this.data = res.body;
      this.spinnerService.hide();
    }, error => {
      this.toastr.error(this.translateService.instant('toastr.somethingWrong'));
      this.spinnerService.hide();
    });

  }

  actionEvent(event: any){
    switch (event.action) {
      case 'delete':
        this.deleteItem(event.id);
        break;
      case 'edit':
        this.editItem(event.id);
        break;
    }
    this.responseForm.controls['id'].setValue(event.id);
  }

  deleteItem(id){
    const config: ModalOptions = {
      initialState: {
        id: id,
        item: 'Respondent'
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, config);
    this.modalRef.setClass('modal-dialog-centered');
    this.modalService.onHide
    .pipe(take(1))                            // stop subscription event bubbling
    .subscribe(() => {
      if (this.modalRef.content.isdeleted){
        this.loadData();
      }
    }, error => {
      this.toastr.error(this.translateService.instant('toastr.somethingWrong'));
    });
  }

  editItem(id){
    this.action = 'edit';
    this.respondentService.getById(id).subscribe((res: any) => {
      this.responseForm.controls['email'].setValue(res.email);
    });
  }

  onModalClick(){
    this.action = 'add';
    this.responseForm.controls['email'].setValue('');
  }

  onSubmit(){
    if (this.responseForm.valid) {
      this.spinnerService.show();
      if (this.action == 'edit'){
        this.respondentService.postUpdate(this.responseForm.value).subscribe((res) => {
          this.toastr.success(this.translateService.instant('toastr.editSuccess'));
          this.spinnerService.hide();
          this.loadData();
        }, error => {
          this.toastr.error(this.translateService.instant('toastr.somethingWrong'));
          this.spinnerService.hide();
        });
      }
      else if (this.action == 'add'){
        this.responseForm.controls['id'].setValue(0);
        this.respondentService.postAdd(this.responseForm.value).subscribe((res) => {
          this.toastr.success(this.translateService.instant('toastr.createSuccess'));
          this.spinnerService.hide();
          this.loadData();
        }, error => {
          this.toastr.error(this.translateService.instant('toastr.somethingWrong'));
          this.spinnerService.hide();
        });
      }
      this.closeModal();
    }
    this.responseForm.markAllAsTouched();
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }

}
