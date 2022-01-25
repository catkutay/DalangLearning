import { Injectable } from '@angular/core';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import 'firebase/firestore';
import { Word } from '../models/word.interface';
import { Observable } from 'rxjs';
import 'capacitor-firebase-upload-file';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  audioBlob: any;
  audio: any;
  //confirmationResult: AngularFireAuth.ConfirmationResult;
  constructor(
    public loadingCtrl: LoadingController,
    public firestore: AngularFirestore,
    private af: AngularFireStorage,
    // private storage: Storage,
    private fireAuth: AngularFireAuth
  ) {}
//remote actions with firestore and firebase database
  createWord(
    english: string,
    language: string,
    example: string,
    partOfSpeech: string,
    audio: string
  ): Promise<void> {
    const id = this.firestore.createId();
    //this.uploadFilename(language);
    return this.firestore.doc(`wordList/${id}`).set({
      id,
      english,
      language,
      example,
      partOfSpeech,
      audio,
    });
  }
 //word structure set under Models
  updateWord(
    id: string,
    english: string,
    language: string,
    example: string,
    partOfSpeech: string,
    audio: string
  ): Promise<void> {
    //this.uploadFilename(language);
    return this.firestore.doc(`wordList/${id}`).set({
      id,
      english,
      language,
      example,
      partOfSpeech,
      audio,
    });
  }
  getWordList(): Observable<Word[]> {
    return this.firestore.collection<Word>(`wordList`).valueChanges();
  }
  getWordDetail(wordId: string): Observable<Word> {
    return this.firestore
      .collection('wordList')
      .doc<Word>(wordId)
      .valueChanges();
  }
  deleteWord(wordId: string): Promise<void> {
    return this.firestore.doc(`wordList/${wordId}`).delete();
  }
  deleteFile(fileName: string): Promise<void> {
    return this.af.storage.refFromURL(fileName).delete();
  }

  
  public signInWithPhoneNumber(recaptchaVerifier, phoneNumber) {
    //yet to be implemented
    return new Promise<any>((resolve, reject) => {
      this.fireAuth
        .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          //FIXME this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        })
        .catch((error) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
  }
  async uploadFilename(fileName: string) {
    //remote uplaod to firestore
    Filesystem.readFile({
      path: fileName,
      directory: Directory.Data,
    }).then((result) => {
      console.log(result);
      var filedata = result.data;
      var fileType = 'audio/wav';

      let id = 'test';
      var folder = new Date().getTime();
      var metadata = {
        contentType: fileType,
      };
//name firestore files with data to choose latest if need to
      
      let userProfileRef = this.af.ref(`/${id}/${folder}/${fileName}`);
      userProfileRef
        .putString(result.data, 'base64', metadata)
        .then((snapshot) => {})
        .catch((error) => {});
    });
  }
}
