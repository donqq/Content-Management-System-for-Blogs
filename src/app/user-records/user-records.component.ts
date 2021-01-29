/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ContentRecordsService } from '../services/content-records.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { UserAttributesType } from '../interfaces/Interfaces';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-records',
  templateUrl: './user-records.component.html',
  styleUrls: ['./user-records.component.css']
})
export class UserRecordsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['username', 'email', 'role'];
  dataSourceObsv: Observable<UserAttributesType[]>; // {username: "", email: "", role :""},
  subscription: Subscription;
  crSubscription: Subscription;
  subscriptionUsers: Subscription;

  constructor(private crService: ContentRecordsService, private snackbar: MatSnackBar, private auth: AuthService,
              private dialog: MatDialog, private messages: MessageService, private router: Router) {}

  ngOnInit() {

    if (this.auth.dbUser.role !== 'admin') {
      this.messages.showMessage('You have no permission to access to the user page');
      this.router.navigate(['/']);
      return;
    }
   // here it returns [{0  :  { userid: , role: , userinfo : { email: , username: }} }]
    this.dataSourceObsv = this.crService.retrieveAllUsers().pipe(
      map(users =>  { // values are emitted from the database (observable)
        const datasourcearray: UserAttributesType[] = [];

        users.forEach(user => {
          datasourcearray.push({
            username: user.userinfo.username,
            email: user.userinfo.email,
            role : user.role
          });
        });

        return datasourcearray;
      })
    );
  }

  ngOnDestroy() {
    if (this.crSubscription) {
      this.crSubscription.unsubscribe();
    }

    if (this.subscriptionUsers) {
      this.subscriptionUsers.unsubscribe();
    }
  }

  cancelFilling(form: NgForm) {
    form.value.username = '';
    form.value.email = '';
  }

  addUser(form: NgForm) {
    const arrySet = new Uint8Array(12); // blank array with 12 spaces
    window.crypto.getRandomValues(arrySet); // fill that areas with random numbers
    const password = btoa(String.fromCharCode(...arrySet)); // call fromCharCode with arrySet arguments, and convert number to characters
    const username = form.value.userName;
    const email = form.value.email;
    const displaypicture = '';
    const personalname = '';

    this.auth.signup(username, email, password, displaypicture, personalname)
    .then(() => {
      const matdialogref: MatDialogRef<DialogComponent> = this.dialog.open(DialogComponent, {
          data : {
            content : 'User Is Created. Please copy the password and save it. Password is : ' + password}
          });
    }, (error) => {
      this.messages.showMessage('Error: ' + error);
    });
  }
}
