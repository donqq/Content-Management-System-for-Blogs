/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase';
import { ContentRecordsService } from './content-records.service';
import { IUser } from '../interfaces/Interfaces';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase/app';
import { IUserDb } from '../interfaces/Interfaces';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userObserv: Observable<firebase.User>;
  public firebaseUser: firebase.User = {} as firebase.User; // to detect user logged in state. .
  public dbUser: IUserDb = {} as IUserDb;

    /* subscriber uses next method to pass new values to the observer when subscribed.
  onAuthStateChanged calls subscriber with the information of the user when user's login state changes
  then we can receive the user's information through subscribe method. (see Angular what I learned document for more info.)
  */
 // this.user = auth.auth.onAuthStateChanged();

  constructor(private authService: AngularFireAuth, private ctnService: ContentRecordsService) {
    this.userObserv = new Observable(subscriber => {
      authService.auth.onAuthStateChanged(subscriber);
    });
  }

  async signin(email: string, password: string): Promise<Observable<never> | Observable<string>> {
    try {
      if (email.length < 4 || password.length < 6 || !email || !password) {
        return throwError('either email or password is short');
      }
      // sign in user with the email, and the password. since it returns a promise, await waits until function returns.
      await this.authService.auth.signInWithEmailAndPassword(email, password);

      // use the uid, and take the userrole, and displayname.
      // toPromise() convert an observable to promise, and await waits until the code is executed, and a value is returned.
      // the returned value is extracted out of the promise (instead of using thenable), and assign to the variable.

      this.dbUser = await this.ctnService.retrieveCurrentUser(this.firebaseUser.uid).pipe(
        take(1), // get the first emitted value.
        map(elements => { // [{…}, {…}, {…}]
            const elementsArray = elements.map(element => {
              // one by one {…}, {…}, {…}
            return {[element.payload.key] : element.payload.val()};
            // modify each element, and return to callback, then all modifications to elementsArray as [{…}, {…}, {…}].
          });
            return Object.assign({}, ...elementsArray );
            // | spread opeartor: [{…}, {…}, {…}] => Copy properties in {…}, {…}, {…} | => One { ....... }
        }),
      ).toPromise();

      console.log(this.dbUser);

      localStorage.setItem('user', JSON.stringify(this.dbUser));
      return of('Success');

    } catch (error) {
      return throwError(error);
    }
  }

  /*export interface IUserDb {
  userid: string;
  role: string;
  userinfo: {
    username: string;
    email: string;
    displaypicture: string;
    personalname: string;
  };
}*/

  async signout(): Promise<void | Observable<never>> {
    try {
      localStorage.removeItem('user');
      await this.authService.auth.signOut();
    } catch (error) {
      return throwError(error);
    }
  }

  currentUser() {
    return this.authService.auth.currentUser;
  }

  async signup(username: string, email: string, password: string, displaypicture: string, personalname: string):
  Promise<void | Observable<never>>  { // currently an admin can register a user.

    const firebaseApp: firebase.app.App = firebase.initializeApp(environment.firebaseConfig, 'signupInstance');
    // a new app instance is created to prevent the current user from logging out.
    // the whole purpose of this instance is to add a new user to the database. once it's done, the instance is deleted.

    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
    .then((user: auth.UserCredential) => {

      user.user.updateProfile({ // set the username
        displayName: username
      });

      user.user.sendEmailVerification() // email the user to verification.
        .then(() => {
        }, (error) => {
          return throwError(error);
        });


       // [{0  :  { userid: , role: , userinfo : { email: , username: , displaypicture: , personalname: }} }]
      // tslint:disable-next-line: object-literal-shorthand
      const userProfile: IUser = {email: email, displaypicture: displaypicture,
        // tslint:disable-next-line: object-literal-shorthand
        userid: user.user.uid, personalname: personalname, username: username, role: 'user' };
      // userProfile is used when signing up. this userProfile is a local variable; hence no connection to its global version.

      // update in the database as well.
      this.ctnService.addUserRecord(userProfile);
      firebaseApp.delete(); // delete the sign up app instance.

    }, (error) => {
      return throwError(error);
    });
  }

  loggedIn() {
    return !!localStorage.getItem('user');
  }
}
