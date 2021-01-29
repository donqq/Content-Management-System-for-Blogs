/* Copyright (C) 2021/January Badde Liyanage Don Dilanga ( github@dilanga.com ) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Simple non code license (SNCL)
 * https://tldrlegal.com/license/simple-non-code-license-(sncl)
 * You should have received a copy of the Simple non code license (SNCL) with
 * this file. If not, please write to: github@dilanga.com , or visit : https://github.com/donqq/Content-Management-System-for-Blogs
 */

export interface IRecord {
  uniqueID: string;
  topicName: string;
  plagirismScore: string;
  editorFeedback: string;
  articleRate: string;
  paidOrNot: string;
  articleURL: string;
  fileSubmittedDate: string;
  userName: string;
}

export interface IUser {
  email: string;
  displaypicture: string;
  userid: string;
  personalname: string;
  username: string;
  role: string;
}

export interface UserAttributesType {
  username: string;
  email: string;
  role: string;
}

export interface IUserDb {
  userid: string;
  role: string;
  userinfo: {
    username: string;
    email: string;
    displaypicture: string;
    personalname: string;
  };
}

export interface Dialogdata {
  content: string;
}

export interface SendingContent {
  content: string;
  depth: string;
}

export interface UserMeta {
  username: string;
  uid: string;
}
