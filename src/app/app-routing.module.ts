import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'daily',
    loadChildren: () => import('./daily/daily.module').then( m => m.DailyPageModule)
},
{
  path: '',
  redirectTo: 'daily',
  pathMatch: 'full'
},
{
  path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
},
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./questions/questions.module').then( m => m.QuestionsPageModule)
  },
  {
    path: 'ranking',
    loadChildren: () => import('./ranking/ranking.module').then( m => m.RankingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
