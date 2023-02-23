import { NgxSpinnerService } from 'ngx-spinner';
import { Question, SubmittedAnswer, QuestionOption, Comment } from './../models';
import { Constant } from './../../../constant';
import { CheckBox, ImageChoice, NumberChoice, RadioButtons, TextChoice } from './../../../enums/questionTypeEnum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveySubmissionService } from 'src/app/services/survey-submission/survey-submission.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { isNullOrEmptyWhiteSpace, sortQuestionsByOrder } from '../../shared/uttils';
import { SurveyQuestionOptionsService } from 'src/app/services/surveyquestionoptions/surveyquestionoptions.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-survey',
  templateUrl: './user-quiz-page.component.html',
  styleUrls: ['./user-quiz-page.component.scss']
})
export class UserQuizPageComponent implements OnInit, OnDestroy {
  questions: Question[];
  comments: Comment[];
  token: string;
  userForm: FormGroup;
  userQuizArrayFormGroup: FormArray;
  tokenIsValid = false;
  displayOptions: any[];
  answeredQuestions: SubmittedAnswer[];
  submited = false;
  surveyId: 0;
  respondentEmail: string;
  defaultHasOthersConstant = Constant.hasOtherOption;
  surveyDescription: string;
  surveyTitle: string;
  private changeSub: Subscription;
  constructor(
    private route: Router,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private surveySubmissionService: SurveySubmissionService,
    private surveyQuestionOptionsServiceService: SurveyQuestionOptionsService,
    private commentService: CommentService,
    private spinnerService: NgxSpinnerService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,

  ) {
    this.activateRoute.paramMap.subscribe(params => {
      this.token = this.activateRoute.snapshot.queryParamMap.get('token');
    });
  }

  ngOnInit(): void {
    this.getSurveyQuestions();
    this.translateService.use('en');

    this.changeSub = this.languageService.languageChange.subscribe((language: string) => {
      this.translateService.use(language);

    });
  }

  setSurveyId(param): void {
    this.surveyId = param;
  }
  ngOnDestroy(): void {
    this.changeSub.unsubscribe();
  }
  prepareAnswers(): any {
    for (let index = 0; index < this.questions.length; index++) {
      const question = this.questions[index];
      const questionType = question.questionType;
      const othersAnswer = this.userForm.get('questionAnswers')['controls'][index].controls.other.value;
      if (questionType === RadioButtons) {
        if (question.hasOthers && othersAnswer !== null) {
          const defaultOtherOption = this.getOtherQuestionOption(question);
          this.userForm.get('questionAnswers')['controls'][index].controls.questionOptionId.setValue(defaultOtherOption.id);

        }
      }
      else if (questionType === CheckBox) {
        if (question.hasOthers && othersAnswer !== null) {
          const defaultOtherOption = this.getOtherQuestionOption(question);
          this.userForm.get('questionAnswers')['controls'][index].controls.questionOptionId.setValue(defaultOtherOption.id);
        }
      }
      else if (questionType === ImageChoice) {
        // do nothing as there is no need to process image choice
      }
      else if (questionType === NumberChoice || questionType === TextChoice) {
        const firstOption = question.surveyQuestionOptions[0];
        console.log(question.surveyQuestionOptions[0]);
        this.userForm.get('questionAnswers')['controls'][index].controls.questionOptionId.setValue(firstOption.id);
      }
    }
    const answeredQuestions = this.userQuizArrayFormGroup.value;
    return answeredQuestions;
  }

  submit(): void {
    const submittedAnsers = this.prepareAnswers();
    const payload = {
      surveyId: this.surveyId,
      respondentEmail: this.respondentEmail,
      answers: submittedAnsers
    };
    const { formIsValid, message } = this.validateForm(submittedAnsers);
    if (formIsValid) {
      this.spinnerService.show();
      this.surveySubmissionService.submitSurvey(payload, this.token).subscribe((res: any) => {
        this.spinnerService.hide();
        this.toastr.success(this.translateService.instant('successSubmission'));
        this.route.navigate(['/thankyou']);
        

      }, error => {
        this.handleErrorResponse(error);
        this.spinnerService.hide();
      });
    } else {
      this.toastr.error(message);
    }
  }
  onAddComment(): void {
    console.log(this.userForm.get('surveyCommentsAdd')['controls'][0].controls.commentTextAdd.value);
   // console.log(this.comments[0]);
    const comText = this.userForm.get('surveyCommentsAdd')['controls'][0].controls.commentTextAdd.value;
    const payload = {
      commentId: 0,
      surveyId: 0,
      respondentId: 0,
      commnetText: comText
    };
      this.spinnerService.show();
    let promise = new Promise((resolve, reject) => {
      this.commentService.postAdd(payload, this.token).subscribe((res: any) => {
        this.spinnerService.hide();
        this.toastr.success(this.translateService.instant('commentSubmission'));
        
        //location.reload();
       // this.route.navigate(['/thankyou']);
        resolve('done');

      }, error => {
        this.handleErrorResponse(error);
          this.spinnerService.hide();
          reject('error');
      });
    });

    Promise.resolve('done')
      .then((val) => {
        setTimeout(() => {
          this.getSurveyQuestions()
        }, 200)})
      .then((val) => this.initForm())
      .catch((err) => console.error(err));
      //this.getSurveyQuestions();
      //this.initForm();

  }

  getOtherQuestionOption(question): QuestionOption {
    return question.surveyQuestionOptions.find(option => option.option === this.defaultHasOthersConstant);
  }

  getQuestionOptions(questionId: number): Question {
    return this.questions.find(question => question.id === questionId);
  }

  getQuestionAnswers(questionId: number): FormGroup {
    return this.userForm.get('questionAnswers')['controls'].find(question => question.controls.questionId.value === questionId);
  }

  optionChecked(checked: boolean, questionOrder: number, questionOptionIdIndex: number, optionId: number): void {
    const question = this.questions[questionOrder];
    if (checked) {
      this.addCheckedOption(question, questionOptionIdIndex, optionId);
    } else {
      this.removeCheckedOption(question, questionOptionIdIndex);
    }
  }

  addCheckedOption(question: Question, optionIdIndex: number, optionId: number): void {
    const questionAnswers = this.getQuestionAnswers(question.id);
    questionAnswers.controls.questionOptionIds['controls'][optionIdIndex].setValue(optionId);
    questionAnswers.controls.other.setValue(null);
    questionAnswers.controls.other.disable();
  }

  removeCheckedOption(question: Question, optionIdIndex: number): void {
    const questionAnswers = this.getQuestionAnswers(question.id);
    questionAnswers.controls.questionOptionIds['controls'][optionIdIndex].setValue(0);
    const checkedOptionsCount: number = questionAnswers.controls.questionOptionIds.value.filter(id => id !== 0).length;
    if (checkedOptionsCount === 0) {
      questionAnswers.controls.other.enable();
    }
  }

  radioChange(clickedcQuestionId, question): void {
    const questionAnswers = this.getQuestionAnswers(question.id);
    questionAnswers.controls.questionOptionId.setValue(clickedcQuestionId);
    if (question.hasOthers) {
      const otherOption = this.getOtherQuestionOption(question);
      if (clickedcQuestionId !== otherOption.id) {
        questionAnswers.controls.other.disable();
        questionAnswers.controls.other.setValue(null);
      }
      else {
        questionAnswers.controls.other.enable();
      }
    }
  }

  toggleImage(questionOrder: number, imageId: number): void {
    const question = this.questions[questionOrder];
    const questionAnswers = this.getQuestionAnswers(question.id);
    const currentValue = questionAnswers.controls.questionOptionId.value;
    if (currentValue === 0 || currentValue !== imageId) {
      questionAnswers.controls.questionOptionId.setValue(imageId);
    } else {
      questionAnswers.controls.questionOptionId.setValue(0);
    }
  }
  imgClicked(questionOrder: number, imageId: number): boolean {
    const question = this.questions[questionOrder];
    const questionAnswers = this.getQuestionAnswers(question.id);
    const currentValue = questionAnswers.controls.questionOptionId.value;
    return imageId === currentValue;
  }
  getSurveyQuestions(): void {
    this.spinnerService.show();
    this.surveySubmissionService.getSurveyDataForRespondent(this.token).subscribe((res: any) => {
      console.log(res);
      this.tokenIsValid = true;
      this.questions = res.survey.questionDtos.sort(sortQuestionsByOrder);
      this.surveyId = res.survey.id;
      this.surveyTitle = res.survey.title;
      this.surveyDescription = res.survey.description;
      this.respondentEmail = res.email;
      this.comments = res.survey.commentDtos;
      // The following property is needed to filter out the default option in Other
      this.displayOptions = this.questions.map(question => (
        question.surveyQuestionOptions.filter(option => option.option !== this.defaultHasOthersConstant)
      ));
      this.answeredQuestions = this.questions.map(question => (
        {
          questionId: question.id,
          questionOptionId: 0,
          questionOptionIds: [],
          other: null
        } as SubmittedAnswer));
      this.spinnerService.hide();
      this.initForm();

    }, error => {
        this.handleErrorResponse(error);
        this.spinnerService.hide();
    });
  }

  initForm(): void {
    this.userQuizArrayFormGroup = new FormArray([]);
    this.userForm = new FormGroup({
      questionAnswers: this.userQuizArrayFormGroup,
      surveyComments: new FormArray([]),
      surveyCommentsAdd: new FormArray([])
    });
   const CommentForm = new FormGroup({
      'commentTextAdd': new FormControl('', Validators.required),
      'commentIdAdd': new FormControl(''),
      'respondentAdd': new FormControl(''),
    });
    (<FormArray>this.userForm.get('surveyCommentsAdd')).push(CommentForm);
    let countComments = 0; //index for comments
    this.comments.forEach((comment) => {
      let surveyCommentItem = this.prepareComment(null);
      surveyCommentItem.patchValue(this.prepareComment(comment));
      (<FormArray>this.userForm.get('surveyComments')).push(surveyCommentItem);

      countComments++;
    });
   
    this.questions.forEach(question => {
      const quesitonOptionCheckBoxes = (question.surveyQuestionOptions).map(
        option => (new FormControl(0))
      );
      if (question.questionType === CheckBox) {
        const checkBoxFormGroup = new FormGroup({
          'questionId': new FormControl(question.id),
          'questionOptionId': new FormControl(0),
          'questionOptionIds': new FormArray(quesitonOptionCheckBoxes, Validators.required),
          'other': new FormControl(null)
        });
        (<FormArray>this.userForm.get('questionAnswers')).push(checkBoxFormGroup);
      }
      else if (question.questionType === RadioButtons) {
        const radioQuestionFormGroup = new FormGroup({
          'questionId': new FormControl(question.id),
          'questionOptionId': new FormControl(0, Validators.required),
          'questionOptionIds': new FormArray([]),
          'other': new FormControl({ value: null, disabled: true })
        });
        (<FormArray>this.userForm.get('questionAnswers')).push(radioQuestionFormGroup);
      }
      else if (question.questionType === ImageChoice) {
        const imageUrls = new FormArray([]);
        const optionList = question.surveyQuestionOptions;
        const imageQuestionFormGroup = new FormGroup({
          'questionId': new FormControl(question.id),
          'questionOptionId': new FormControl(0, Validators.required),
          'questionOptionIds': new FormArray([]),
          'imageUrls': imageUrls,
          'other': new FormControl(null)
        });
        optionList.forEach((option) => {
          this.spinnerService.show();
          this.surveyQuestionOptionsServiceService.getImage(option.id).subscribe((img: any) => {
            const optionGroup = new FormGroup({
              'id': new FormControl(0),
              'url': new FormControl('')
            });
            optionGroup.patchValue(
              {
                'id': img.id,
                'url': img.option
              }
            );
            (<FormArray>imageQuestionFormGroup.get('imageUrls')).push(optionGroup);
            this.spinnerService.hide();
          })
        }
        );
        (<FormArray>this.userForm.get('questionAnswers')).push(imageQuestionFormGroup);
      }
      else if (question.questionType === TextChoice || question.questionType === NumberChoice) {
        const radioQuestionFormGroup = new FormGroup({
          'questionId': new FormControl(question.id),
          'questionOptionId': new FormControl(0, Validators.required),
          'questionOptionIds': new FormArray([]),
          'other': new FormControl(null)
        });
        (<FormArray>this.userForm.get('questionAnswers')).push(radioQuestionFormGroup);
      }
    });
  }
  private isNull(id) {
    if (id === 0 || id === null || id === '' || typeof id === "undefined" || id === undefined)
      return true;
    else return false;
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
      surveyCommentItem = {
        'commentText': comment.commnetText,
        'surveyId': comment.surveyId,
        'commentId': comment.commentId,
        'respondentId': comment.respondentId,
        'respondent': comment.respondent.email ? comment.respondent.email:"",

      }
    }
    return surveyCommentItem;
  }
  handleErrorResponse(error): void {
    if (error.status === 400) {
      // Check if survey has expired
      if (error.error.hasOwnProperty('surveyHasExpired')) {
        const message = this.translateService.instant('survey') + ' ' + error.error.message + ' ' + this.translateService.instant('surveyHasExpired');
        this.toastr.info(message);
        this.route.navigate(['/hasVoted', false]);
        return;
      }
      // Check if user has voted
      else if (error.error.hasOwnProperty('hasVoted') && error.error.hasOwnProperty('email')) {
        const message = error.error.email + ' ' + this.translateService.instant('hasVoted');
        this.toastr.info(message);
        this.route.navigate(['/hasVoted', true]);
        return;
      }
      // Check if survey exists
      else if (error.error.hasOwnProperty('invalidSurvey')) {
        const message = this.translateService.instant('invalidSurvey');
        this.toastr.error(message);
        this.route.navigate(['/invalidpage']);
        return;
      }
      // Check if email exists
      else if (error.error.hasOwnProperty('invalidEmail')) {
        const message = this.translateService.instant('invalidEmail');
        this.toastr.error(message);
        this.route.navigate(['/invalidpage']);
        return;
      }
      // Check if token is valid
      else if (error.error.hasOwnProperty('invalidToken')) {
        const message = this.translateService.instant('invalidPage');
        this.toastr.error(message);
        this.route.navigate(['/invalidpage']);
        return;
      }
      // Check if required question is unanswered
      else if (error.error.hasOwnProperty('unansweredQuestionOrder')) {
        const unansweredQuestion = error.error.unansweredQuestionOrder;
        const message = this.translateService.instant('question') + ' ' + unansweredQuestion + ' ' + this.translateService.instant('isRequired') + '!';
        this.toastr.error(message);
        return;
      }

      else {
        this.toastr.error(error.error.message);
        return;
      }
    }
    else {
      this.toastr.error(this.translateService.instant('internalError'));
      this.route.navigate(['/invalidpage']);
      return;
    }
  }
  validateForm(payload: any[]): any {
    const requiredQuestions: number[] = [];
    let formIsValid = true;
    let message = '';
    for (let index = 0; index < payload.length; index++) {
      const question = this.questions[index];
      const questionOrder = index + 1;
      if (question.isRequired) {
        const questionPayload = payload[index];
        if (question.questionType === RadioButtons) {
          if (questionPayload.questionOptionId === 0) {
            requiredQuestions.push(questionOrder);
          }
        }
        else if (question.questionType === CheckBox) {
          // In case checkBox array is empty
          if (questionPayload.questionOptionIds.every(id => id === 0) && (questionPayload.questionOptionId === 0)) {
            requiredQuestions.push(questionOrder);
          }
        }
        else if (question.questionType === NumberChoice) {
          // In case checkBox array is empty
          if (questionPayload.questionOptionId === 0) {
            requiredQuestions.push(questionOrder);
          }
          if (isNullOrEmptyWhiteSpace(questionPayload.other)) {
            // Clicked Other but left the stars empty
            requiredQuestions.push(questionOrder);
          }
        }
        else if (question.questionType === TextChoice) {
          if (questionPayload.questionOptionId === 0) {
            requiredQuestions.push(questionOrder);
          }
        }
        else if (question.questionType === ImageChoice) {
          if (questionPayload.questionOptionId === 0) {
            requiredQuestions.push(questionOrder);
          }
        }
      }
    }

    if (requiredQuestions.length !== 0) {
      formIsValid = false;
      if (requiredQuestions.length === 1) {
        message = this.translateService.instant('question') + ' ' + requiredQuestions[0].toString() + ' ' + this.translateService.instant('isRequired') + '!';
      } else {
        message = this.translateService.instant('questions') + ' ' + requiredQuestions.toString() + ' ' + this.translateService.instant('areRequired') + '!';
      }
    }
    return {
      formIsValid,
      message,
    }
  }
}
