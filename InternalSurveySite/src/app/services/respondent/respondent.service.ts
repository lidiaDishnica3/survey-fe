import { Injectable } from '@angular/core';
import { Pagination } from 'src/app/components/shared/Pagination';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RespondentService {

  private postAddEndpoint = 'respondent/Add';
  private getAllEndpoint = 'respondent/GetAll';
  private getByIdEndpoint = 'respondent/GetById';
  private postUpdateEndpoint = 'respondent/Update';
  private postDeleteEndpoint = 'respondent/Delete';

  constructor(private apiService: ApiService) { }

  postAdd(data) {
    return this.apiService.post(this.postAddEndpoint, data);
  }

  getAll(pagination?: Pagination) {

    let url = `${this.getAllEndpoint}`;

    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  postUpdate(data) {
    return this.apiService.put(this.postUpdateEndpoint, data);
  }

  deleteRespondent(id) {
    return this.apiService.delete(this.postDeleteEndpoint + '/' + id, id);
  }

}
