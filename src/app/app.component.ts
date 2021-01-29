/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CopyscapeAPIService } from './services/copyscape-api.service';
import { IUserDb } from './interfaces/Interfaces';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public userSub: Subscription;

  constructor(private service: CopyscapeAPIService, private auth: AuthService, private message: MessageService, private router: Router) {
  }

  // get the user details globally.always available in root level.
  // useful for login, and after login state is loaded.
  ngOnInit() {
    this.userSub = this.auth.userObserv.subscribe(user => {
      // when login to the page by clicking on the button
      this.auth.firebaseUser = user; // firebase.User type
      this.getUserTokenId(this.auth.firebaseUser);

      if (!user) {
        localStorage.removeItem('user');
        this.auth.signout();
        console.log('You are not logged in');
        this.message.showMessage('You are not logged in');
        this.router.navigate(['/']);
      }
    });

    if (localStorage.getItem('user')) {
      this.auth.dbUser = JSON.parse(localStorage.getItem('user')) as IUserDb;
      // get the user information, and assign it to auth.dbUser with IUserDb type
    }
  }

  async getUserTokenId(user: firebase.User) { // TO GET TOKEN ID FOR TESTING PURPOSE.
    // console.log('User Token : '  + await user.getIdToken()); // for DEBUGGING PURPOSE
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
