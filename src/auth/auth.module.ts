import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from './shared/shared.module';

export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
      },
      {
        path: 'register',
        loadChildren: './register/register.module#RegisterModule'
      }
    ]
  }
]

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyAMb6xm1tP6EbN-UKSr69cuNAHh72YgGBM",
  authDomain: "angular-ultimate-course-app.firebaseapp.com",
  databaseURL: "https://angular-ultimate-course-app.firebaseio.com",
  projectId: "angular-ultimate-course-app",
  storageBucket: "angular-ultimate-course-app.appspot.com",
  messagingSenderId: "535641808302"
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule.forRoot()
  ]
})
export class AuthModule {}
