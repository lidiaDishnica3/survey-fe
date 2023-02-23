import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { SurveyQuestionOptionsService } from 'src/app/services/surveyquestionoptions/surveyquestionoptions.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Location } from '@angular/common';
import { MatEndDate } from '@angular/material/datepicker';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit, OnDestroy {

  // #region properties
  surveyForm: FormGroup; //create/update form
  selectedOption = [];  //question type selected
  questionIdsToRemove = []; // array which contains all questions to delete when we update a survey
  optionsIdsToRemove = []; // array which contains all options to delete when we update a survey
  editMode = false; // if it is an edit => comes the value from route
  id: 0; // if it is an edit => comes the value from route
  public imagePath: ImageData[] = []; //contains all the new uploaded images to be saved in 
  file: [null];
  @ViewChild('fileInput', { static: false }) el: ElementRef;
  @ViewChild('picker1') picker1;
  questions; //question types from enum  
  error: any = { isError: false, errorMessage: '' };
  isValidDate: any; //end date is valid 
  isDisabled: any; // if form is disabled cannot be edited
  isDisabledComment: any;
  isHiddenComment: any;
  private changeSub: Subscription;
  // #endregion

  // #region constructor
  constructor(
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private commentService: CommentService,
    private route: Router,
    private router: ActivatedRoute,
    private surveyQuestionOptionsServiceService: SurveyQuestionOptionsService,
    private SpinnerService: NgxSpinnerService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private location: Location) {
    this.router.paramMap.subscribe(params => {
      this.setIdEditMode(params.get('id'), params.get('editMode'));
    });
  }
  // #endregion

  // #region onInit onDestroy
  ngOnInit() {
    this.isHiddenComment = this.id == null ? true : false;
    this.initForm();

    // #region translate language
    this.questions = this.storageService.getStorage('language') == 'sq' ? this.questionService.questionTypesArraySq() : this.questionService.getQuestionTypesArray();
    this.translateService.use(this.storageService.getStorage('language'));
    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.questions = (language == 'sq') ? this.questionService.questionTypesArraySq() : this.questionService.getQuestionTypesArray();
      this.translateService.use(language);
    });
    // #endregion

    if (this.isNotNull(this.id))
      this.editSurvey(this.id);
  }
  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
  // #endregion

  // #region upload/get/remove images
  uploadFile(event, i, j) {
    this.SpinnerService.show();
    const reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imgData = new ImageData(Number(i), Number(j), reader.result.toString());
        //list of images to save
        file = reader.result;
        if (this.imagePath.length > 0) {
          let element = this.findImagePath(j, i); // if edit image
          if (this.isNotNull(element)) this.imagePath.splice(this.imagePath.findIndex(x => x == element), 1);
        }
        this.imagePath.push(imgData);
        this.getImages(i, j);
      };
      this.cd.markForCheck();
    }
    this.SpinnerService.hide();
  }
  getImages(i, j) {
    let elementFilePath = this.findImagePath(j, i);
    if (!isNullOrUndefined(elementFilePath)) return elementFilePath.filepath;
    else return null;
  }
  removeUploadedFile(questionIndex, itemIndex) {
    let elementFilePath = this.findImagePath(itemIndex, questionIndex);
    if (this.isNotNull(elementFilePath)) {
      this.file = [null];
      this.imagePath.splice(this.imagePath.findIndex(x => x == elementFilePath), 1);
    }
    (this.imagePath.filter(x => x.indexOption > itemIndex && x.indexQuestion == questionIndex)).forEach(i => {
      i.indexOption = i.indexOption - 1;
    });
  }
  // #endregion

  // #region operations for question
  onAddQuestion() {
    const surveyQuestionItem = this.prepareQuestion(null);
    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
  }
  onRemoveQuestion(index, id, questionType) {
    if (this.isNotNull(id)) this.questionIdsToRemove.push(id);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup = new FormGroup({});
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionType = new FormControl({});
    if (questionType == 3) {
      let elementFilePath = this.imagePath.filter(el => el.indexQuestion == index); //all options of the question
      if (this.isNotNull(elementFilePath)) {
        elementFilePath.forEach(i => {
          this.imagePath.splice(this.imagePath.findIndex(x => x == i), 1);
        });
      }
    }
    (this.imagePath.filter(x => x.indexQuestion > index)).forEach(i => {  //change question index
      i.indexQuestion = i.indexQuestion - 1;
    });
    (<FormArray>this.surveyForm.get('surveyQuestions')).removeAt(index);
    this.selectedOption.splice(index, 1);
  }
  onRemoveComment(index, id) {
    console.log(index);
    console.log(id);
    //this.error = this.commentService.deleteComment(id).subscribe();
    this.commentService.deleteComment(id).subscribe(() => {
      (<FormArray>this.surveyForm.get('surveyComments')).removeAt(index);
      this.selectedOption.splice(index, 1);
    }, error => {
        this.toastr.info(this.translateService.instant('error.cantDeleteComment'));
    });
    //console.log(this.commentService.deleteComment(id).subscribe());
    //if (this.error.ok == true) {
    //  (<FormArray>this.surveyForm.get('surveyComments')).removeAt(index);
    //  this.selectedOption.splice(index, 1);
    //}
    //else {
    //  this.toastr.info(this.translateService.instant('error.cantDeleteComment'));
    //}
  }
  prepareoptions(index, hasOthers) {
    let options = new FormArray([]);
    let showRemarksBox = new FormControl(hasOthers);
    (this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup).addControl('options', options);
    (this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup).addControl('showRemarksBox', showRemarksBox);
  }
  onAddComment() {
    const surveyCommentItem = this.prepareComment(null);
    (<FormArray>this.surveyForm.get('surveyComments')).push(surveyCommentItem);
  }
  //edit survey questions options
  editSurvey(id) {
    this.SpinnerService.show();
    this.surveyService.getByIdExtended(id).subscribe((entity: any) => {
      if (entity === '') this.toastr.error(this.translateService.instant('error.somethingWentWrongRetry'));
      this.isDisabled = entity.startDate == null ? false : true;
      if (this.isDisabled) this.toastr.info(this.translateService.instant('error.cantEditSurvey'));

      let endDateOfEntity = Date.parse(entity.endDate);
      this.isDisabledComment = entity.startDate == null || endDateOfEntity<Date.now() ? true : false;
      this.surveyForm.patchValue(this.prepareSurvey(entity));
      let surveyQuestions = entity.questionDtos;
      let count = 0; //index for question
      surveyQuestions.forEach((question) => {
        if (question.deletedOn === null) {
          this.defaultValueForQuestion(question);
          this.onEditQuestion(question, count);
        }
        count++;
      });
      console.log(entity);
      let surveyComments = entity.commentDtos;
      let countComments = 0; //index for question
      surveyComments.forEach((comment) => {
        let surveyCommentItem = this.prepareComment(null);
        surveyCommentItem.patchValue(this.prepareComment(comment));
        console.log(surveyCommentItem);
         (<FormArray>this.surveyForm.get('surveyComments')).push(surveyCommentItem);
      
        countComments++;
      });
      this.SpinnerService.hide();
    }, error => {
      this.toastr.error(this.translateService.instant('error.somethingWentWrong'));
      this.SpinnerService.hide();
    });
  }
  onSeletQuestionType(questionType, index, id, questionCtrl) {
    let options = questionCtrl.controls.questionGroup.controls.options;
    if (this.isNotNull(id)) {
      options.controls.forEach(option => {
        this.optionsIdsToRemove.push(option.controls.Id.value);
      });
    }
    this.prepareoptions(index, false);
    this.clearFormArray((<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options));
    if (questionType === 4 || questionType === 5) {
      this.addOption(index, questionType);
    }
    else {
      this.addOption(index, questionType);
      this.addOption(index, questionType);
    }
  }
  onEditQuestion(question: any, count) {
    const surveyQuestionItem = this.prepareQuestion(null);
    surveyQuestionItem.patchValue(this.prepareQuestion(question));
    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
    this.selectedOption[count] = question.questionType;

    let optionsList = question.surveyQuestionOptions;
    optionsList.forEach((option) => {
      if (option.deletedOn === null) {
        const optionGroup = this.prepareOptionForm(null, question.questionType, null);

        if (question.questionType === 3) {
          this.SpinnerService.show();
          this.surveyQuestionOptionsServiceService.getImage(option.id).subscribe((img: any) => {

            optionGroup.patchValue(this.prepareOptionForm(option, question.questionType, img));
            this.SpinnerService.hide();
          }, error => {
            this.toastr.error(this.translateService.instant('error.somethingWentWrong'));
            this.SpinnerService.hide();
          });
        }
        else optionGroup.patchValue(this.prepareOptionForm(option, question.questionType, null));
        this.prepareoptions(count, question.hasOthers);
        if (option.option !== 'hasOtherOption2929') // hasOtherOption2929-> text to distinguish other option
          (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][count].controls.questionGroup.controls.options).push(optionGroup);
      }
    });
  }
  // #endregion

  // #region operations for option save/add/remove
  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  addOption(index, questionType) {
    if (questionType === 5) {
      const optionGroup = new FormGroup({
        'optionText': new FormControl(''),
      });
      (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
    }
    else if (questionType === 4) {
      const optionGroup = new FormGroup({
        'optionText': new FormControl(null, [Validators.required, Validators.min(5), Validators.max(10)]),
      });
      (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
    }
    else {
      const optionGroup = new FormGroup({
        'optionText': new FormControl('', Validators.required),
      });
      (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
    }
  }
  removeOption(questionIndex, itemIndex, id, image = null) {
    if (this.isNotNull(id)) this.optionsIdsToRemove.push(id);
    if (image !== null) this.removeUploadedFile(questionIndex, itemIndex);
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][questionIndex].controls.questionGroup.controls.options).removeAt(itemIndex);
  }
  // #endregion

  // #region save survey
  onSubmit() {
    let formData = this.surveyForm.value;
    this.isValidDate = this.validateDates((new Date()), formData.endDate);
    if (this.isValidDate && this.surveyForm.valid) {
      if (!this.editMode) this.postSurvey();
      else this.updateSurvey();
    }
    else
      this.toastr.warning(this.translateService.instant('error.requiredFields'));
  }

  postSurvey() {
    this.SpinnerService.show();
    let formData = this.surveyForm.value;
    let QuestionDtos = [];
    let CommentDtos = [];
    let surveyQuestions = formData.surveyQuestions;
    let questionIndex = 0; //questions index to get the image
    surveyQuestions.forEach((question) => { //foreach question save question and options
      this.defaultValueForQuestion(question);
      let questionItem = this.preparesaveQuestion(question);

      if (question.questionGroup.hasOwnProperty('showRemarksBox')) {
        questionItem.hasOthers = question.questionGroup.showRemarksBox; // question has others
      }
      if (question.questionGroup.hasOwnProperty('options')) {
        let optionIndex = 0; //options index to get the image
        question.questionGroup.options.forEach(option => { //foreach option 
          let optionItem;
          let elementFilePath = null;
          if (question.questionType === 3) { //if question is type image than get url
            elementFilePath = this.findImagePath(optionIndex, questionIndex);
            optionItem = this.getOptionItem(option, null, elementFilePath, 3);
          }
          else optionItem = this.getOptionItem(option, null, null, null);

          questionItem.SurveyQuestionOptions.push(optionItem);
          optionIndex++;
        });
      }
      QuestionDtos.push(questionItem); //push questions in data survey
      questionIndex++;
    });
    let data = new Survey(0, formData.surveyTitle, null, formData.endDate.toLocaleString(), formData.surveyDescription, null, QuestionDtos, CommentDtos);
    this.SpinnerService.show();
    this.surveyService.addSurveyTotal(data).subscribe((entity: any) => {
      if (entity === '') this.toastr.error(this.translateService.instant('error.somethingWentWrongRetry'));
      this.route.navigate(['/survey']);
      this.toastr.success(this.translateService.instant('success.createdSuccessfully'));
      this.SpinnerService.hide();
    }
      , error => {
        if (error.status === 400) this.toastr.error(error.message);
        else this.toastr.error(this.translateService.instant('error.internalError'));
        this.SpinnerService.hide();
      });
  }

  updateSurvey() {
    this.SpinnerService.show();

    let formData = this.surveyForm.value;
    let QuestionDtos = [];
    let surveyQuestions = formData.surveyQuestions;
    let questionIndex = 0; //questions index to get image path
    surveyQuestions.forEach((question) => {
      this.defaultValueForQuestion(question);
      let questionItem = this.preparesaveQuestion(question);
      if (question.questionGroup.hasOwnProperty('showRemarksBox'))
        questionItem.hasOthers = question.questionGroup.showRemarksBox;

      if (question.questionGroup.hasOwnProperty('options')) {
        let optionIndex = 0; //option index to get image path
        question.questionGroup.options.forEach(option => {
          let optionItem;
          let elementFilePath = null;
          if (question.questionType === 3) {
            elementFilePath = this.findImagePath(optionIndex, questionIndex);
            optionItem = this.getOptionItem(option, question, elementFilePath, 3);
          }
          else optionItem = this.getOptionItem(option, question, null, null);

          questionItem.SurveyQuestionOptions.push(optionItem);
          optionIndex++;
        });
      }
      QuestionDtos.push(questionItem);
      questionIndex++;
    });

    let data = new Survey(this.id, formData.surveyTitle, null, formData.endDate.toLocaleString(), formData.surveyDescription, null, QuestionDtos, []);

    this.surveyService.updateSurveyTotal(data).subscribe((entity: any) => {
      if (entity === '') this.toastr.error(this.translateService.instant('error.somethingWentWrongRetry'));
      this.deleteQuestionAndOptions();
      this.route.navigate(['/survey']);
      this.toastr.success(this.translateService.instant('success.updatedSuccessfully'));
      this.SpinnerService.hide();
    }
      , error => {
        if (error.status === 400) this.toastr.error(error.message);
        else this.toastr.error(this.translateService.instant('error.internalError'));
        this.SpinnerService.hide();
      });
  }
  // #endregion

  // #region private methods
  private initForm() {
    this.surveyForm = this.prepareSurvey();
    if (this.isNull(this.id)) this.onAddQuestion();
  }
  goBack() { // navigate back
    this.location.back();
  }
  open() { // open datetime picker
    this.picker1.open();
  }
  //method to get id and editMode from route if its edit
  setIdEditMode(surveyId, editMode) {
    this.id = surveyId;
    this.editMode = editMode;
  }
  prepareSurvey(survey = null) {
    let surveyElement;
    if (this.isNull(survey)) {
      surveyElement = new FormGroup({
        'surveyTitle': new FormControl('', [Validators.required]),
        'endDate': new FormControl('', [Validators.required]),
        'surveyDescription': new FormControl(''),
        'surveyQuestions': new FormArray([]),
        'surveyComments': new FormArray([]),
      });
    }
    else {
      surveyElement = {
        'surveyTitle': survey.title,
        'surveyDescription': survey.description,
        'endDate': survey.endDate,
        'surveyQuestions': survey.questionDtos,
        'surveyComments': survey.commentDtos,
      }
    }
    return surveyElement;
  }
  deleteQuestionAndOptions() {
    if (this.optionsIdsToRemove.length > 0) {
      this.optionsIdsToRemove.forEach((idToRemove) => {
        this.surveyQuestionOptionsServiceService.deleteSurveyQuestionOptions(idToRemove).subscribe(i => {
        });
      });
    }
    if (this.questionIdsToRemove.length > 0) {
      this.questionIdsToRemove.forEach((idToRemove) => {
        this.questionService.deleteQuestion(idToRemove).subscribe(i => {
        });
      });
    }
  }
  defaultValueForQuestion(question) {
    if (this.isNull(question.questionOrder)) question.questionOrder = 0;
    if (this.isNull(question.isRequired)) question.isRequired = false;
    return question;
  }
  prepareOptionForm(option = null, type = null, img = null) {
    let optionItem;
    if (this.isNull(option)) {
      optionItem = new FormGroup({
        'optionText': type == 4 ? new FormControl(null, [Validators.required, Validators.min(5), Validators.max(10)]) : new FormControl(''),
        'Id': new FormControl(''),
        'imageUrls': new FormControl(''),
        'questionId': new FormControl('')
      });
    }
    else {
      optionItem = {
        'optionText': type === 3 ? null : option.option,
        'Id': option.id,
        'imageUrls': type === 3 ? img.option : null,
        'questionId': option.questionId,
      }
    }
    return optionItem;
  }
  prepareQuestion(question = null) {
    let surveyQuestionItem;
    if (this.isNull(question)) {
      surveyQuestionItem = new FormGroup({
        'questionTitle': new FormControl('', Validators.required),
        'questionType': new FormControl('', Validators.required),
        'isRequired': new FormControl(''),
        'Id': new FormControl(''),
        'questionDescription': new FormControl(''),
        'questionOrder': new FormControl(''),
        'hasOthers': new FormControl(''),
        'deletedOn': new FormControl(''),
        'questionGroup': new FormGroup({}),
      });
    }
    else {
      surveyQuestionItem = {
        'questionTitle': question.title,
        'questionDescription': question.description,
        'questionOrder': question.order,
        'isRequired': question.isRequired,
        'questionType': question.questionType,
        'hasOthers': question.hasOthers,
        'surveyId': question.surveyId,
        'Id': question.id,
        'deletedOn': question.deletedOn,
        'questionGroup': question.surveyQuestionOptions,
      }
    }
    return surveyQuestionItem;
  }
  prepareComment(comment = null) {
    let surveyCommentItem;
    if (this.isNull(comment)) {
      surveyCommentItem = new FormGroup({
        'commentText': new FormControl('', Validators.required),
        'commentId': new FormControl(''),
        'respondent': new FormControl(''),
      });
    }
    else {
      surveyCommentItem ={
        'commentText': comment.commnetText,
        'surveyId': comment.surveyId,
        'commentId': comment.commentId,
        'respondentId': comment.respondentId,
        'respondent': comment.respondent.email,

      }
    }
    return surveyCommentItem;
  }
  preparesaveQuestion(question) {
    let questionItem = {
      'ID': this.isNotNull(question.Id) ? question.Id : 0,
      "QuestionType": +question.questionType,
      "Title": question.questionTitle,
      "Description": question.questionDescription,
      "Order": question.questionOrder,
      "IsRequired": question.isRequired,
      "hasOthers": false,
      "SurveyId": 0,
      "SurveyQuestionOptions": [],
    }
    return questionItem;
  }
  preparesaveComment(comment) {
    let commentItem = {
      'ID': this.isNotNull(comment.commentId) ? comment.commentId : 0,
      'commentText': comment.CommnetText,
      'surveyId': 0,
      'respondentId': 0
    }
    return commentItem;
  }
  findImagePath(optionIndex, questionIndex) {
    return this.imagePath.find(el => el.indexOption === optionIndex && el.indexQuestion === questionIndex);
  }
  getOptionItem(option, question, elementFilePath, type) {
    let optionElement;
    if (type === 3) {
      optionElement = {
        "ID": this.isNotNull(option.Id) ? option.Id : 0,
        "Option": elementFilePath != undefined ? elementFilePath.filepath : "",
        "QuestionId": this.isNotNull(question?.Id) ? question.Id : 0,
      }
    }
    else {
      optionElement = {
        "ID": this.isNotNull(option.Id) ? option.Id : 0,
        "Option": option.optionText,
        "QuestionId": this.isNotNull(question?.Id) ? question.Id : 0,
      }
    }
    return optionElement;
  }
  // data validation
  validateDates(sDate: Date, eDate: Date) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      this.error = { isError: true, errorMessage: this.translateService.instant('form.endDateValidator') };
      this.isValidDate = false;
    }
    else {
      this.error = { isError: false, errorMessage: '' };
      return this.isValidDate;
    }
  }
  private isNull(id) {
    if (id === 0 || id === null || id === '' || typeof id === "undefined" || id === undefined)
      return true;
    else return false;
  }
  private isNotNull(id) {
    if (id !== 0 && id !== null && id !== '' && typeof id !== 'undefined' && id !== undefined) return true;
    else return false;
  }
  // #endregion
}
export class ImageData {
  constructor(
    public indexQuestion: number,
    public indexOption: number,
    public filepath: string = null,
  ) { }
}
export class Survey {

  public ID: number;
  public Title: string;
  public StartDate: Date = null;
  public EndDate: Date;
  public Description: string;
  public DeletedOn: Date = null;
  public QuestionDtos: [];
  public CommentDtos: [];

  constructor(id, title, startDate, endDate, description, deleteOn, questionDtos, commentDtos) {
    this.ID = id;
    this.Title = title;
    this.StartDate = startDate;
    this.EndDate = endDate;
    this.Description = description;
    this.DeletedOn = deleteOn;
    this.QuestionDtos = questionDtos;
    this.CommentDtos = commentDtos;
  }
}
