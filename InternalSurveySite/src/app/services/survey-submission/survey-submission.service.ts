import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SurveySubmissionService {
  private submitSurveyEndpoint = 'SurveySubmission/submit';
  private getSurveyDataForRespondentEndpoint = 'SurveySubmission/GetSurveyDataForRespondent';
  constructor(private apiService: ApiService) { }

  submitSurvey(data: any, token: string): Observable<any>{
    const urlWithTken = this.submitSurveyEndpoint + `?` + `token=${token}`;
    return this.apiService.post(urlWithTken, data);
  }

  getSurveyDataForRespondent(token: string): Observable<any>{
    const urlWithTken = this.getSurveyDataForRespondentEndpoint + `?` + `token=${token}`;
    return this.apiService.get(urlWithTken);
  }
}
