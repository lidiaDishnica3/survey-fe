export interface Survey {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  questions: Question[];
  comments: Comment[];
}

export interface Comment {
  commentId: number;
  commnetText: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  hasOthers: boolean;
  isRequired: boolean;
  questionType: number;
  surveyQuestionOptions: QuestionOption[];
}

export interface QuestionOption {
  id: number;
  option: string;
}

export interface SubmittedAnswer {
  questionId: number;
  questionOptionId: number;
  questionOptionIds: number[];
  other: string;
}
