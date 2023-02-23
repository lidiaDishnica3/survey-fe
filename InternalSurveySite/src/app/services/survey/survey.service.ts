import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/components/shared/Pagination';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private getByIdEndpoint = 'survey/GetById';
  private getByIdExtendedEndpoint = 'survey/GetByExtendedId';

  private getSurvyesEndpoint = 'survey/GetAll';
  private getSurvyesPublishedEndpoint = 'survey/GetAllPublished';
  private addSurveyEndPoint = 'survey/Add';
  private addSurveyTotalEndPoint = 'survey/AddSurveyTotal';
  private updateSurveyEndpoint = 'survey/Update';
  private updateSurveyTotalEndpoint = 'survey/UpdateSurveyTotal';
  private publishSurveyEndpoint = 'survey/Publish';
  private deleteSurveyEndpoint = 'survey/Delete';
  private switchOffRespondentsSurveyEndpoint = 'survey/SwitchOffRespondents';

  private getRespondentsForASuvey = 'survey/GetRespondentsForASuvey';
  private getResponsesFromQuestions = 'survey/GetResponsesFromQuestions';

  constructor(
    private apiService: ApiService

  ) { }

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  getRespondentsForASurvey(id) {
    return this.apiService.get(this.getRespondentsForASuvey + '/' + id);
  }

  getResponsesFromQuestion(id) {
    return this.apiService.get(this.getResponsesFromQuestions + '/' + id);
  }

  getByIdExtended(id: number) {
    return this.apiService.get(this.getByIdExtendedEndpoint + '/' + id);
  }

  getAll(pagination?: Pagination) {
    let url = `${this.getSurvyesEndpoint}`;

    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }
   getAllPublished(pagination?: Pagination) {
     let url = `${this.getSurvyesPublishedEndpoint}`;

    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  addSurvey(data) {
    return this.apiService.post(this.addSurveyEndPoint, data);
  }
  addSurveyTotal(data) {
    return this.apiService.post(this.addSurveyTotalEndPoint, data);
  }

  updateSurvey(data) {
    return this.apiService.put(this.updateSurveyEndpoint, data);
  }
  updateSurveyTotal(data) {
    return this.apiService.put(this.updateSurveyTotalEndpoint, data);
  }
  publishSurvey(data) {
    return this.apiService.put(this.publishSurveyEndpoint, data);
  }

  deleteSurvey(id) {

    var data = this.apiService.get(this.getByIdEndpoint + '/' + id);

    return this.apiService.delete(this.deleteSurveyEndpoint + '/' + id, data);
  }

  getSurveyDataForSwitchOffRespondents(token: string): Observable<any> {
    const urlWithTken = this.switchOffRespondentsSurveyEndpoint + `?` + `token=${token}`;
    return this.apiService.get(urlWithTken);
  }
}
