import { PaginationModel } from './PaginationModel';

export class Pagination {

  constructor(paginationModel?: PaginationModel) {
    if (paginationModel != null) {
      this.PageNumber = paginationModel.PageNumber == 0 || paginationModel.PageNumber == null ? 1 : paginationModel.PageNumber;
      this.PageSize = paginationModel.PageSize == 0 || paginationModel.PageSize == null ? 10 : paginationModel.PageSize;
    }
  }

  public PageSize: number = 10;
  public PageNumber: number = 1;
  get Skip() {
    return (this.PageNumber - 1) * this.PageSize;
  }
}
