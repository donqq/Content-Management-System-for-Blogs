/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import 'firebase/storage';
import {ThemePalette} from '@angular/material/core';
import { isArray } from 'util';
import {CopyscapeAPIService} from '../services/copyscape-api.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-plagiarism-upload',
  templateUrl: './plagiarism-upload.component.html',
  styleUrls: ['./plagiarism-upload.component.css']
})
export class PlagiarismUploadComponent implements OnInit, OnDestroy {

  showButton: boolean;
  param: any;
  selectedDepthValue: number;
  subscribe: Subscription;
  plagiarismScore: string;
  uploadedDate: string;
  subscriptionTask: Subscription;
  subscriptionRef: Subscription;

  // for Progressbar
  colour: ThemePalette;
  progress: number;
  showProgressBar: boolean;

  constructor(private plagiarismAPI: CopyscapeAPIService, private afStorage: AngularFireStorage, private message: MessageService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }

    if (this.subscriptionTask) {
      this.subscriptionTask.unsubscribe();
    }

    if (this.subscriptionRef) {
      this.subscriptionRef.unsubscribe();
    }
  }


  agInit(params: any) {
    this.selectedDepthValue = params.context.parentComponent.selectedDepthValue;

    if ((Number(params.data.plagirismScore)) >= 0 ) {
      this.showButton = false;
      this.plagiarismScore = params.data.plagirismScore;
      // this.uploadedDate = params.data.fileSubmittedDate;
    } else {
      this.showButton = true;
    }

    this.param = params;
    this.colour = 'primary';
    this.showProgressBar = false;
    this.progress = 0;
  }

  refresh(params: any) {
    return true;
  }

  public upload(event: Event) {
    this.showProgressBar = true;
    this.showButton = false;
    let file: File;

    const promise = new Promise((resolve, reject) => {
      file = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject('Error in opening the file');
      };

      reader.readAsText(file);
    });

    promise.then((fileTexts: string) => {
      this.checkForPlagiarism(fileTexts, file);
    })
    .catch(error => {
      this.message.showMessage(error);
    });
  }

  private async checkForPlagiarism(fileTexts: string, file: File) {
    this.subscribe = (await this.plagiarismAPI.getPosts({content: fileTexts, depth: this.selectedDepthValue.toString()}))
      .subscribe(rowPlagResult => {
        const plagiarismScore = this.processCopyScapeResult(rowPlagResult);

        if (plagiarismScore >= 0 ) {
          this.plagiarismScore = String(plagiarismScore);
          this.uploadFileToFirebase(file);
        } else {
          this.message.showMessage('Error in checking plagiarism');
        }

      }, error => {
        console.log(error);
        this.message.showMessage(error.message);
      });
  }

  private processCopyScapeResult(input: any): number {
    // console.log(input);
    const percentmatchedArray = [];

    // collect plagiarism scores of the article of each site.
    if (input.response.result) {

      if (!isArray(input.response.result)) { // result is not an array if the result only has one finding.
        input.response.result = [input.response.result]; // make result an array if it's not an array.
      }

      input.response.result.forEach((oneResult: any, index: number) => {
        if (index < this.selectedDepthValue) {
          if (oneResult.percentmatched) {
            percentmatchedArray.push(Number(oneResult.percentmatched));
          }
        }
      });

      if (percentmatchedArray.length > 0) {
        // sort them
        percentmatchedArray.sort((a, b) => a - b);

        // return the largest value
        return percentmatchedArray.slice(-1)[0];
      } else {

        // no plagirism detected
        return 0;
      }

    } else  {// nothing was returned
      if (input.response.allviewurl) { // check at least the URL is made by copyscape. zero plagiarism case.
        return 0;
      } else {
        return -1; // an error.
      }
    }
  }

  // upload file to firebase
  private uploadFileToFirebase(file: File) {
    const randomId = this.randomNumber();
    const ref = this.afStorage.ref(randomId);
    const task = ref.put(file) as AngularFireUploadTask;

    this.subscriptionTask = task.snapshotChanges().pipe(
      finalize(() => {
          this.subscriptionRef = ref.getDownloadURL().subscribe(uploadedFileURL => { // value has
          this.showProgressBar = false;
          this.param.context.parentComponent.topicMeta({
            fileURL: uploadedFileURL, plagiarismScore: this.plagiarismScore
          });
        });
      })
    ).subscribe();
  }

  // misc functions
  private randomNumber() {
    return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
  }

}
