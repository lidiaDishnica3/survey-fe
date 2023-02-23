import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: any;
  showNew: Boolean = false;
  submitType: string = 'Save';
  selectedRow: number;
  editMode = false;
  public modalRef: BsModalRef;

  public columns = [
    { title: 'FirstName', name: 'firstName' },
    { title: 'LastName', name: 'lastName' },
    { title: 'Email', name: 'email'},
    { title: 'Actions', property: 'actions' }
  ];

  public columnsSq = [
    { title: 'Emër', name: 'firstName' },
    { title: 'Mbiemër', name: 'lastName' },
    { title: 'Email-i', name: 'email'},
    { title: 'Veprimet', property: 'actions' } 
  ];

  private changeSub: Subscription;
 userForm: FormGroup;

  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 1, PageSize: 10 };
  onPaginationValuesChange(values: PaginationModel) {
    this.paginationModel = values;
    this.getAll();
  }

  constructor(private usersService: UserService,
    private route: Router,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {
    this.SpinnerService.show();

    this.userForm = new FormGroup({
      //'Id': new FormControl(null),
      'FirstName': new FormControl(null),
      'LastName': new FormControl(null),
      'Email': new FormControl(null),
    });

    this.getAll();
    this.translateService.use(this.storageService.getStorage('language'));

    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);

    });
    this.SpinnerService.hide();

  }
  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
  getAll() {
    let pagination = new Pagination(this.paginationModel);
    this.usersService.getAll(pagination).subscribe((users: any) => {
      this.setPagination = users;
      this.users = users.body;
    }, error => {
      this.toastr.error('Something went wrong!');
    }
    );
  }

  onDelete(id) {
    const config: ModalOptions = {
      initialState: {
        id: id,
        item: 'User'
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, config);
    this.modalRef.setClass('modal-dialog-centered');
    this.modalService.onHide
      .pipe(take(1))
      .subscribe(() => {

        if (this.modalRef.content.isdeleted) {
          this.getAll();
        }
      }, error => {
        this.toastr.error('Something went wrong!');
      });

  }

  onNew() {
    this.route.navigate(['/register-user']);
  }

  onCancel() {
    this.showNew = false;
  }

  actionEvent(event: any) {
    switch (event.action) {
      case 'delete':
        this.onDelete(event.id);
        break;    
    }
  }

  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }
}
