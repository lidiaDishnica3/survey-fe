import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SurveyQuestionOptionsService {

  private getByIdEndpoint = 'surveyQuestionOptions/GetById';
  private getImageUrlEndpoint = 'surveyQuestionOptions/GetImageById';
  private getSurveyQuestionOptionsEndpoint = 'surveyQuestionOptions/GetAll';
  private addSurveyQuestionOptionsEndPoint = 'surveyQuestionOptions/Add';
  private updateSurveyQuestionOptionsEndpoint = 'surveyQuestionOptions/Update';
  private deleteSurveyQuestionOptionsEndpoint = 'surveyQuestionOptions/Delete';

  constructor(
    private apiService: ApiService

  ) { }

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  getImage(id) {
    return this.apiService.get(this.getImageUrlEndpoint + '/' + id);
  }

  getAll() {
    return this.apiService.get(this.getSurveyQuestionOptionsEndpoint);
  }

  addSurveyQuestionOptions(data) {
    return this.apiService.post(this.addSurveyQuestionOptionsEndPoint, data);
  }

  updateSurveyQuestionOptions(data) {
    return this.apiService.put(this.updateSurveyQuestionOptionsEndpoint, data);
  }

  deleteSurveyQuestionOptions(id) {

    var data = this.apiService.get(this.getByIdEndpoint + '/' + id);

    return this.apiService.delete(this.deleteSurveyQuestionOptionsEndpoint + '/' + id, data);
  }
}
