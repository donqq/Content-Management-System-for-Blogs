/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlagiarismUploadComponent } from '../plagiarism-upload/plagiarism-upload.component';
import { ContentRecordsService } from '../services/content-records.service';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {formatDate } from '@angular/common';
import { IRecord, IUserDb } from '../interfaces/Interfaces';
import { UserMeta } from '../interfaces/Interfaces';
import { AuthService } from '../services/auth.service';
import { flatMap, map, take } from 'rxjs/operators';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-content-records',
  templateUrl: './content-records.component.html',
  styleUrls: ['./content-records.component.css']
})
export class ContentRecordsComponent implements OnInit, OnDestroy {

  title = 'Content Mangement App';
  private gridApi: any;
  rowSelection: string;
  rowData = []; // rowData is needed only for providing the initial datasource. don't use it again (reason is in the doc)
  subscriptionTopics: Subscription;
  subscriptionUsers: Subscription;
  gridOptions = {context: {parentComponent: this}};
  currentUserKey: string;
  searchdepthValues = [];
  selectedDepthValue = 2 as number; // 2 is the default value;
  users: UserMeta[] = [];
  userNames = [];
  selectedRows = [];
  oldID: string;

  columnDefs = [
    {headerName: 'Unique ID', field: 'uniqueID', editable: false, resizable: true, sortable: true,
      valueGetter: (params) => params.data.uniqueID ? params.data.uniqueID : ' '},
    {headerName: 'Topic Name', field: 'topicName', editable: true, resizable: true, sortable: true,
      valueGetter: (params) => params.data.topicName ? params.data.topicName : ' '},
    {headerName: 'Submitted Date', field: 'fileSubmittedDate', resizable: true, autoHeight: true,
      valueGetter: (params) => params.data.fileSubmittedDate ? params.data.fileSubmittedDate : ' '},
    {headerName: 'Plagiarism Score', field: 'plagirismScore', resizable: true, autoHeight: true,
      cellRendererFramework: PlagiarismUploadComponent},
    {headerName: 'Editor Feedback', field: 'editorFeedback', editable: true, resizable: true,
      valueGetter: (params) => params.data.editorFeedback ? params.data.editorFeedback : ' '},
    {headerName: 'Article Rate', field: 'articleRate', editable: true, resizable: true, type: 'numericColumn',
      valueGetter: (params) => params.data.articleRate ? params.data.articleRate : 0},
    {headerName: 'Paid Or Not', field: 'paidOrNot', editable: true, resizable: true,
      valueGetter: (params) => params.data.paidOrNot ? params.data.paidOrNot : ' '},
    {headerName: 'Article URL', field: 'articleURL', editable: true, resizable: true,
      valueGetter: (params) => params.data.articleURL ? params.data.articleURL : ' '},
    {headerName: 'User Name', field: 'userName', editable: true, resizable: true,
      valueGetter: (params) => params.data.userName ? params.data.userName : ' ',
      cellEditor: 'agSelectCellEditor', cellEditorParams: { values: this.userNames}} // NOT ALLOWING NULL VALUES.
  ];

  constructor(private crService: ContentRecordsService,
              private snackbar: MatSnackBar, private auth: AuthService, private message: MessageService) {
    this.rowSelection = 'single'; // only a single row can be selected.

    this.searchdepthValues.push(...[...Array(11).keys()].filter(value => value > 0)); // same as for (let i = 1; i < 11; i++) {}

  }

  // all topics are loaded to the rowData array, and thereby to the grid table.
  ngOnInit() {

    if (!this.auth.dbUser) { // no this.auth.dbUser is set.
      return;
    }

    // tslint:disable-next-line: max-line-length
    this.subscriptionTopics = ((this.auth.dbUser.role === 'admin') ?
    this.crService.retrieveAllTopics() : this.crService.retrieveAllTopicsUID(this.auth.dbUser.userid)).pipe(
      /*[ USERID: {reportID : {  } , reportID : {  }}, USERID: {reportID : {  } , reportID : {  }} ]. USERID IS NOT RETURNED.
      TARGET
      [ {reportID : {RECORD} , reportID : {RECORD}}, {reportID : {RECORD} , reportID : {RECORD}} ]
      TO
      [{RECORD} , {RECORD} , {RECORD} ]*/

      map(recordsMultiUser => { // [ USERID: {reportID : {  } , reportID : {  }}, USERID: {reportID : {  } , reportID : {  }} ]
        if (this.auth.dbUser.role === 'admin') {
          return recordsMultiUser.flatMap(recordsSingleUser => {  // {reportID : {  } , reportID : {  }}
            return Object.keys(recordsSingleUser).map(record => { // [reportID, reportID, reportID] => reportID
              return recordsSingleUser[record]; // {}
            }); // RETURN [{}, {}, {}]
          }); // return [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]] => with FLATMAP [{}, {}, {}, {}, {}, {}, {}, {}, {}]
        } else { // IF it's a USER
          return recordsMultiUser; // [reportID : {RECORD}, {}, {}, {}, {}, {}, {}, {}, {}]. reportID is not returned due to VALUECHANGE
        }
      })
    ).subscribe(topics => {
      if (topics) {
        this.rowData = topics;
      }
    }, error => {
      this.message.showMessage(error);
    });

    // LOAD USERS TO DROP DOWN BOX
    if (this.auth.dbUser.role === 'admin') {
      this.subscriptionUsers = this.crService.retrieveAllUsers().pipe(
        map(Users => {
            /* (2) [{…}, {…}]
            0: {role: "admin", userid: "XXX", userinfo: {…}}
            1: {role: "user", userid: "XXX", userinfo: {…}}
            CONVERT TO
            [ userNameOne ,  usernameTwo ]
          */
          return Users.map((user: IUserDb) => {
            // {role: "admin", userid: "XXX", userinfo: {…}}
            return {username: user.userinfo.username, uid: user.userid};
          }); // username: [user.userinfo.username, ..]
        })
      ).subscribe(users => {
        // retrieve users one after another but each user as an array periodically from the data stream.
        if (users) {
          this.users.length = 0;
          this.users.push(...users); // for ADMINS

          // update the usernames
          this.userNames.length = 0;
          this.users.forEach((user: UserMeta) => {
            this.userNames.push(user.username);
          });
        }
      }, error => {
        this.message.showMessage(error);
      });
    } else {
      this.users.length = 0;
      this.users.push({username: this.auth.dbUser.userinfo.username,  uid: this.auth.dbUser.userid}); // for USER

      // update the usernames
      this.userNames.length = 0;
      this.users.forEach((user: UserMeta) => {
          this.userNames.push(user.username);
      });
    }
  }

  // when the component is destroyed, unsubscribe from the observable.
  ngOnDestroy() {
    if (this.subscriptionTopics) {
      this.subscriptionTopics.unsubscribe();
    }
  }

  // The grid API is provided. gridApi is needed to manage records in the grid.
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  // If return true, the editor will appear in a popup
  isPopup() {
    return true;
  }

  // button functions
  // insert record function doesn't add records to the database, only to the UI. Use update to add records to the database.
  async insertRecord() {
    const newItem = this.createNewRowData();
    this.gridApi.updateRowData({ add: [newItem] }); // in new version it's applyTransaction.
    await this.crService.addRecordUID(newItem, this.auth.dbUser.userid); // insert the record in the database.
  }


  async onCellValueChanged(param) { // update the records.
    if (!param.data) { // !param.data
      return;
    }

    const newData: IRecord = {
      uniqueID: param.data.uniqueID,
      topicName: param.data.topicName,
      plagirismScore: param.data.plagirismScore,
      editorFeedback: param.data.editorFeedback,
      articleRate: param.data.articleRate,
      paidOrNot: param.data.paidOrNot,
      articleURL: param.data.articleURL,
      fileSubmittedDate: param.data.fileSubmittedDate,
      userName: param.data.userName
    };

    // if the edited field is userName (author) field, then delete the current record, and add a new record with new username.
    if (param.colDef) {
      // topicMeta function calls onCellValueChanged after file was uploaded to update fields.
      // Since it has no colDef it raises an exception.
      if (param.colDef.field === 'userName') {
        let oldUserName =  param.oldValue; // get the Value before editing.

        if (oldUserName.toString().includes('|')) { // For legacy purpose
          oldUserName = oldUserName.split('|')[0];
        }
        // send a delete request to the database with the old uid.
        // delete the old record.
        this.crService.removeRecordUID(newData.uniqueID, this.getUIDByUserName(oldUserName)).subscribe(() => {
        }, (error) => {
          this.message.showMessage(error);
        });

        // add a new record with updated values.
        await this.crService.addRecordUID(newData, this.getUIDByUserName(newData.userName)); // insert the record in the database.
      }

      return; // Execution is over since deleting, and insertion were done.
    }

    const uid = (this.auth.dbUser.role === 'admin') ? this.getUIDByUserName(newData.userName) : this.auth.dbUser.userid ;
    // if the user id ADMIN the uid is taken from the userName, otherwise the UID is taken from AUTH service.

    const uniqueId = newData.uniqueID;
    this.crService.updateRecordUID(uniqueId, newData, uid).subscribe(() => {

    }, (error) => {
      this.message.showMessage(error);
    });
  }

  getUIDByUserName(userName: string): string {
    return this.users.filter((user: UserMeta) => {
      return user.username === userName; // check whether given username is equal to an existing username value.
    })[0].uid; // get the UID of the particular user.
  }

  // executed by the copyscape api component, use to send topicID, and fileURl back to the main component.
  public topicMeta({fileURL, plagiarismScore}) {
    let rowParam: any;

    this.selectedRows.forEach((row) => {
      rowParam = {data: row}; // {data: {FIELD1: , FIELD2: , FIELD3: }};
      row.articleURL = fileURL;
      // changing here row.property affects rowParam as well as values are asisgned by reference when it's objects.
      row.plagirismScore = plagiarismScore;
      row.fileSubmittedDate = formatDate(new Date(), 'medium', 'en-GB', '+0530');
    });

    this.gridApi.updateRowData({ update: this.selectedRows }); // for now only one row is selected.[{ROW, and META}]
    this.onCellValueChanged(rowParam);
  }

// when a row is selected, its value is read through data property. node property has isSelected() method
// that has the ability to find out whether the row is selected or not. The onRowSelected() event is fired
// when a row is selected and deselected.
  onRowSelected() {
    this.selectedRows = this.gridApi.getSelectedRows(); // [{DATA, and META information of selected ROW}]
  }

  deleteRecord() {
    const selectedData = this.gridApi.getSelectedRows(); // [{.. PROPERTIES HERE.. , MORE DATA to identify NODEs}] if it's SELECTED ONE.
    this.gridApi.updateRowData({ remove: selectedData });
    const uid = (this.auth.dbUser.role === 'admin') ? this.getUIDByUserName(selectedData[0].userName) : this.auth.dbUser.userid ;
    this.crService.removeRecordUID(selectedData[0].uniqueID, uid).subscribe(() => {
      this.message.showMessage(`Record ${selectedData[0].uniqueID} was deleted`);
    }, (error) => {
      this.message.showMessage(error);
    });
  }

  selectedDepth(value: number) { // set the depth value
    this.selectedDepthValue = value;
  }

  // blank new record
  createNewRowData(Data?: IRecord): IRecord {
    const newData: IRecord = {
      uniqueID: this.randomNumber(),
      topicName: 'none',
      plagirismScore: 'none',
      editorFeedback: 'none',
      articleRate: 'none',
      paidOrNot: 'none',
      articleURL: 'none',
      fileSubmittedDate: 'none',
      userName: 'none'
    };
    return newData;
  }

  // misc functions
  private randomNumber() {
    return Math.floor(1000 * Math.random()).toString();
  }
}
