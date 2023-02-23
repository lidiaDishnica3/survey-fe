import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private postAddEndpoint = 'comment/Add';
  private getBySurveyIdEndpoint = 'comment/GetCommentBySurveyId';
  private getByIdEndpoint = 'comment/GetById';
  private postDeleteEndpoint = 'comment/Delete';

  constructor(private apiService: ApiService) { }

  postAdd(data, token) {
    const urlWithTken = this.postAddEndpoint + `?` + `token=${token}`;
    return this.apiService.post(urlWithTken, data);
  }

  getBySurveyId(surveyId) {
    return this.apiService.get(this.getBySurveyIdEndpoint + '/' + surveyId);
  }

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }


  deleteComment(id) {
    return this.apiService.delete(this.postDeleteEndpoint + '/' + id, id);
  }

}
