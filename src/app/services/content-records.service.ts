/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import { IUser} from '../interfaces/Interfaces';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class ContentRecordsService {

  // service to connect with the Angular Database, and perform various add, remove, update functions
  constructor(private db: AngularFireDatabase, private message: MessageService) {
  }

  // -------------------------- TOPICS --------------------------
  public addRecordUID(recordValue: any, uid: string) {
    return this.db.list('/reports/' + uid).push(recordValue);
    // this return THENABLE reference.
  }

  // can ignore automatically generated ID in refrence path when searching.
  // like reference.toString()  = reports/UID/reportID/uniqudID here reportID is automatically generated.
  // so when searching list(/reports/UID) UID is required since it's not automatically generated value.
  public updateRecordUID(recordUniqueId: string, recordValue: any, uid: string) {
    return new BehaviorSubject(null).pipe(
      switchMap(() => {
        return this.db.list('/reports/' + uid,
        ref => ref.orderByChild('uniqueID')
                  .equalTo(recordUniqueId)).query.once('value', datasnapshots => {

                    if (datasnapshots.exists()) { // Value is available, meaning author information was not changed.
                      datasnapshots.child(Object.keys(datasnapshots.val())[0]).ref.update(recordValue);
                    } else { // what if Author information was changed, use here.
                      this.message.showMessage('Error in updating the record');
                    }
                    /* datasnapshots.val() prints an object.
                    {-XXX: {…}}
                    -> EXPANDED
                      -XXX: {articleRate: "none", articleURL: "none", editorFeedback: "none",
                      fileSubmittedDate: "none", paidOrNot: "none", …} */
                  });
      })
    );
  }

  public removeRecordUID(recordUniqueId: string, uid: string) {
    return new BehaviorSubject(null).pipe(
      switchMap(() => {
        return this.db.list('/reports/' + uid,
        ref => ref.orderByChild('uniqueID')
                  .equalTo(recordUniqueId)).query.once('value', datasnapshot => {
                    datasnapshot.child(Object.keys(datasnapshot.val())[0]).ref.remove();
                  });
      })
    );
    // this return THENABLE reference.
  }

  public retrieveAllTopics(): Observable<any> {
    return this.db.list('/reports').valueChanges();
  }

  public retrieveAllTopicsUID(uid: string): Observable<any> {
    return this.db.list('/reports/' + uid).valueChanges();
  }

  // -------------------------- USERS --------------------------
  public retrieveAllUsers(): Observable<any> {
    return this.db.list('/users').valueChanges(); // retrieve all users from users
  }

  public retrieveCurrentUser(uid: string): Observable<any> {
    return this.db.list('/users/' + uid).snapshotChanges(); // retrieve the current user.
  }

  // const userProfile: IUser = {email: email, displaypicture: displaypicture,
  // userid: user.user.uid, personalname: personalname, username: username };
  public addUserRecord(userValue: IUser): Promise<void> {
    return this.db.object('/users/' + userValue.userid).set({
      userid : userValue.userid,
      role : userValue.role, // In this application only users can be added.
      userinfo : {
          email : userValue.email,
          username : userValue.username,
          displaypicture : userValue.displaypicture,
          personalname : userValue.personalname
      }
    });
  }


  public updateUserRecord(nodeKey: string, userValue: any) { // nodeKey = uid here
    return this.db.list('/users').update(nodeKey, {
      userinfo : userValue
    });
  }
}
