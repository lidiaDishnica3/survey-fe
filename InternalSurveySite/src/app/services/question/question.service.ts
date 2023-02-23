import { Injectable } from '@angular/core';
import { questionTypesArray,questionTypesArraySq, questionTypeMapping } from 'src/app/enums/questionTypeEnum';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private getByIdEndpoint = 'question/GetById';
  private getQuestionEndpoint = 'question/GetAll';
  private addQuestionEndPoint = 'question/Add';
  private updateQuestionEndpoint = 'question/Update';
  private deleteQuestionEndpoint = 'question/Delete';


  constructor(private apiService: ApiService) {

  }
  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  getAll() {
    return this.apiService.get(this.getQuestionEndpoint);
  }
  getQuestionTypesArray() {
    return questionTypesArray;

  } questionTypesArraySq() {
    return  questionTypesArraySq;
  }
  getQuestionTypes() {
    return questionTypeMapping;
  }

  addQuestion(data) {
    return this.apiService.post(this.addQuestionEndPoint, data);
  }

  updateQuestion(data) {
    return this.apiService.put(this.updateQuestionEndpoint, data);
  }

  deleteQuestion(id) {

    var data = this.apiService.get(this.getByIdEndpoint + '/' + id);

    return this.apiService.delete(this.deleteQuestionEndpoint + '/' + id, data);
  }

}
