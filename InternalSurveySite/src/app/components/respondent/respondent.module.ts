import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedComponentsModule } from '../shared/sharedComponents.module';
import { RespondentComponent } from './respondent.component';


const routes: Routes = [
  {
    path: '',
    component: RespondentComponent
  }
];

@NgModule({
  declarations: [RespondentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      extend: true,
      isolate: true
    }),
    NgxSpinnerModule
  ]
})

export class RespondentModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/languages/respondent/", suffix: ".json" }
  ]);
}
