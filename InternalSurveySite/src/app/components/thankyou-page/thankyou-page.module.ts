import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared/sharedComponents.module'
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { ThankyouPageComponent } from './thankyou-page.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
const routes: Routes = [
  { path: '', component: ThankyouPageComponent, pathMatch: 'full' },
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
  declarations: [ThankyouPageComponent],
  providers: []
})
export class ThankyouPageModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/languages/thankyou-page/", suffix: ".json" }
  ]);
}
