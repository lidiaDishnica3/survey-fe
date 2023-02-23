import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  private postAddEndpoint = 'response/Add';
  private getAllEndpoint = 'response/GetAll';
  private getByIdEndpoint = 'response/GetById';
  private postUpdateEndpoint = 'response/Update';
  private postDeleteEndpoint = 'response/Delete';

  constructor(private apiService: ApiService) { }

  postAdd(data) {
    return this.apiService.post(this.postAddEndpoint, data);
  }

  getAll() {
    return this.apiService.get(this.getAllEndpoint);
  }

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  postUpdate(data) {
    return this.apiService.put(this.postUpdateEndpoint, data);
  }

  deleteRespose(id) {
    return this.apiService.delete(this.postDeleteEndpoint + '/' + id, id);
  }

}
