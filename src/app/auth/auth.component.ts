/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContentRecordsService } from '../services/content-records.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private crService: ContentRecordsService, public auth: AuthService, private message: MessageService) {}

  ngOnInit() {

  }

  async signin(signinForm: NgForm) {
    try {
      const result = await this.auth.signin(signinForm.value.email, signinForm.value.password);

      result.subscribe(message => {
        this.message.showMessage(message + '; User: ' + this.auth.dbUser.userinfo.username + ' is logged in');
      }, error => {
        this.message.showMessage(error);
      });

    } catch (error) {
      this.message.showMessage(error);
    }
  }

  async signout() {
    await this.auth.signout();
  }

  loggedIn() {
    return this.auth.loggedIn();
  }
}
