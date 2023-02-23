import { NgModule } from '@angular/core';
// import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedComponentsModule } from '../shared/sharedComponents.module';
import { HttpClient } from '@angular/common/http';
// import { AppRoutingModule } from 'src/app/app-routing.module';
//import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: SurveyComponent
  }
];

@NgModule({
  declarations: [SurveyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    //FormsModule
    SharedComponentsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    NgSelectModule,
    MatButtonModule,
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
})
export class SurveyModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/languages/survey/", suffix: ".json" }
  ]);
}
