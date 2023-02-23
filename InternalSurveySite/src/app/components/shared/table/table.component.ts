import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { PaginationModel } from '../PaginationModel';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() columns = [];
  @Input() rows = [];
  @Input() edit? = false;
  @Input() delete? = false;
  @Input() publish? = false;
  @Input() published? = false;

  // pagination
  @Input() paginationModel: PaginationModel = { PageNumber: 1, TotalItems: 0, PageSize: 10 };
  public pageNumber: any;
  public pageSize: any;

  pageSizeItems = [
    {'name': '5', 'value': 5},
    {'name': '10', 'value': 10},
    {'name': '15', 'value': 15},
    {'name': '20', 'value': 20},
  ]

  // Languages
  @Input() columnsSq = [];

  @Output() public actionClicked: EventEmitter<any> = new EventEmitter();
  @Output() public paginationEmitter: EventEmitter<PaginationModel> = new EventEmitter();

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    this.pageNumber = this.paginationModel.PageNumber;
    this.pageSize = this.paginationModel.PageSize;
  }

  public getData(row: any, propertyName: string): string {
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  actionEvent(action, id) {
    this.actionClicked.emit({ action: action, id: id });
  }

  formatDate(date) {
    if (date) {
      return moment(new Date(date)).format('DD/MM/YYYY');
    }
  }

  handlePageChange(event) {
    this.pageNumber = event;
    this.paginationModel.PageNumber = this.pageNumber;
    this.paginationModel.PageSize = this.pageSize;
    this.paginationEmitter.emit(this.paginationModel);
  }

  onPageSizeChange(event){
    if(event){
      this.pageSize = event.value;
      this.pageNumber = 1;
      this.paginationModel.PageNumber = this.pageNumber;
      // this.paginationModel.PageSize = this.pageSize;
      this.paginationEmitter.emit(this.paginationModel);
    }
  }


}
