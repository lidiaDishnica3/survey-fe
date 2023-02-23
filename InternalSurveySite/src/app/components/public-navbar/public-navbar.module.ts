import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { PublicNavbarComponent } from './public-navbar.component';

const routes: Routes = [
  {
    path: '',
    component: PublicNavbarComponent
  }
];

@NgModule({
  declarations: [PublicNavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    TranslateModule.forChild()
  ]
})

export class PublicNavbarModule {}
