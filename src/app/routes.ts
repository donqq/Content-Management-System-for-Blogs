import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ContentRecordsComponent } from './content-records/content-records.component';
import { UserRecordsComponent } from './user-records/user-records.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';


export const routes: Routes = [
  {path : '', component: AuthComponent},
  {path : 'content', component: ContentRecordsComponent, canActivate: [AngularFireAuthGuard] },
  {path : 'users', component: UserRecordsComponent, canActivate: [AngularFireAuthGuard] },
]
