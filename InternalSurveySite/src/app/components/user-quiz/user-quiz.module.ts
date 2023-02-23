import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedComponentsModule } from '../shared/sharedComponents.module';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { UserQuizPageComponent } from './user-quiz-page/user-quiz-page.component';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';



const routes: Routes = [
  { path: '', component: UserQuizPageComponent, pathMatch: 'full' },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    FormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      extend: true,
      isolate: true
    })
  ],
  declarations: [UserQuizPageComponent],
  providers: []
})
export class UserQuizModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/languages/user-quiz-submission/", suffix: ".json" }
  ]);
}
