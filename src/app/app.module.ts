import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ContentRecordsComponent } from './content-records/content-records.component';

import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule} from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PlagiarismUploadComponent } from './plagiarism-upload/plagiarism-upload.component';
import { environment } from 'src/environments/environment';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AuthComponent } from './auth/auth.component';
import { RouterModule } from '@angular/router';
import { UserRecordsComponent } from './user-records/user-records.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { routes } from './routes';

@NgModule({
  declarations: [
    AppComponent,
    ContentRecordsComponent,
    PlagiarismUploadComponent,
    AuthComponent,
    UserRecordsComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents(null),
    AgGridModule.withComponents([PlagiarismUploadComponent]),
    AgGridModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatTabsModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    AngularFireModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    RouterModule.forRoot(routes),
    MatMenuModule,
    MatTableModule,
    AngularFireAuthModule,
    MatDialogModule
  ],
  entryComponents: [DialogComponent],
  providers: [AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
