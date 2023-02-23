import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateSurveyComponent } from './create-survey.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared/sharedComponents.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

const routes: Routes = [
  {
    path: '',
    component: CreateSurveyComponent
  },
  {
    path: ':id/:editMode',
    component: CreateSurveyComponent
  }

];
@NgModule({
  declarations: [CreateSurveyComponent],
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    CommonModule,
    NgSelectModule,
    AccordionModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      extend: true,
      isolate: true
    })
  ]
  , exports: [
  ]
})
export class CreateSurveyModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/languages/create-survey/", suffix: ".json" }
  ]);
}
