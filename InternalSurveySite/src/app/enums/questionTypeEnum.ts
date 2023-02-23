export const RadioButtons = 1;
export const CheckBox = 2;
export const ImageChoice = 3;
export const NumberChoice = 4;
export const TextChoice = 5;

export enum questionTypeEnum {
  RadioButtons = 'Single Choice',
  CheckBox = 'Multiple Choice',
  ImageChoice = 'Image',
  NumberChoice = 'Number',
  TextChoice = 'Text'
}
export enum questionTypeEnumSQ {
  RadioButtons = 'Zgjedhje e vetme',
  CheckBox = 'Më shumë se një zgjedhje',
  ImageChoice = 'Zgjedhje me imazh',
  NumberChoice = 'Numër',
  TextChoice = 'Tekst'
}

export const questionTypeMapping = new Map<number, string>([
  [RadioButtons, questionTypeEnum.RadioButtons],
  [CheckBox, questionTypeEnum.CheckBox],
  [ImageChoice, questionTypeEnum.ImageChoice],
  [NumberChoice, questionTypeEnum.NumberChoice],
  [TextChoice, questionTypeEnum.TextChoice],
]);

export const questionTypeMappingSq = new Map<number, string>([
  [RadioButtons, questionTypeEnumSQ.RadioButtons],
  [CheckBox, questionTypeEnumSQ.CheckBox],
  [ImageChoice, questionTypeEnumSQ.ImageChoice],
  [NumberChoice, questionTypeEnumSQ.NumberChoice],
  [TextChoice, questionTypeEnumSQ.TextChoice],
]);


// const ids = Array.from(questionTypeMapping.keys());
export const questionTypesArray = Array.from(questionTypeMapping.keys()).map(id => ({ viewValue: questionTypeMapping.get(id), value: id}));
export const questionTypesArraySq = Array.from(questionTypeMappingSq.keys()).map(id => ({ viewValue: questionTypeMappingSq.get(id), value: id}));
