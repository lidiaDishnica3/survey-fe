import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PublicNavbarComponent } from './components/public-navbar/public-navbar.component';
import { Auth } from './services/auth/auth';


export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [Auth]
      },
      {
        path: 'survey',
        loadChildren: () => import('./components/survey/survey.module').then((m) => m.SurveyModule),
        canActivate: [Auth]
      },

      {
        path: 'user',
        loadChildren: () => import('./components/user-profile/user-profile.module').then(m => m.UserProfileModule),
        canActivate: [Auth]
      },
      {
        path: 'users-all',
        loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule),
        canActivate: [Auth]
      },
      {
        path: 'register-user',
        loadChildren: () => import('./components/register-user/register-user.module').then(m => m.RegisterUserModule),
        canActivate: [Auth]
      },
      {
        path: 'respondent',
        loadChildren: () => import('./components/respondent/respondent.module').then((m) => m.RespondentModule),
        canActivate: [Auth]
      },
      {
        path: 'createsurvey',
        loadChildren: () => import('./components/create-survey/create-survey.module').then((m) => m.CreateSurveyModule),
        canActivate: [Auth]
      }
    ]
  },
  {
    path: '',
    component: PublicNavbarComponent,
    children: [
      {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'user-quiz',
        loadChildren: () => import('./components/user-quiz/user-quiz.module').then((m) => m.UserQuizModule),
      },
      {
        path: 'thankyou',
        loadChildren: () => import('./components/thankyou-page/thankyou-page.module').then((m) => m.ThankyouPageModule),
      }, {
        path: 'invalidpage',
        loadChildren: () => import('./components/invalid-page/invalid-page.module').then((m) => m.InvalidPageModule),
      },
      {
        path: 'hasVoted',
        loadChildren: () => import('./components/has-voted-page/has-voted.module').then((m) => m.HasVotedModule),
      },
    ]
  },
  { path: '**', redirectTo: '/invalidpage', pathMatch: 'full' }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
