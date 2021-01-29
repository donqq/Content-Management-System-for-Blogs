/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SendingContent } from '../interfaces/Interfaces';

@Injectable({
  providedIn: 'root'
})
/* the copyscape APi service is for communicating with the PHP scripts stored in the nucuta web server.
It provides checking plagiarism, and sending email functionalities */

export class CopyscapeAPIService {

  private CopyScapeURL = 'https://localhost:5001/auth/result';

  constructor(private httpClient: HttpClient, private auth: AuthService) { }

  public async getPosts(content: SendingContent): Promise<Observable<any>> {
    const header: HttpHeaders = new HttpHeaders({
       Authorization: 'Bearer ' + await this.auth.firebaseUser.getIdToken(),
       'Content-Type': 'application/json'
    });
    return this.httpClient.post(this.CopyScapeURL, JSON.stringify(content), {headers: header});
  }
}


