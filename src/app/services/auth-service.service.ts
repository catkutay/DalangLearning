import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  confirmationResult: firebase.auth.ConfirmationResult;
  private fireAuth: AngularFireAuth;

  // user: firebase.User = null;
  // userDocument: IUserDocument = null;
  // firstauthevent: boolean = true;
  // authSub: BehaviorSubject<firebase.User> = new BehaviorSubject(null);
  // store: firebase.storage.Storage = firebase.storage();
  
  // constructor(public tools: ToolsService) {
  //   const initialuser = JSON.parse(localStorage.getItem('user'));
  //   this.authSub.next(initialuser);
  //   firebase.auth().onAuthStateChanged((user: firebase.User) => {
  //     console.log('auth user', user);
  //     this.user = user;
  //     this.firstauthevent = false;
  //     if (user) {
  //       localStorage.setItem('user', JSON.stringify(user));
  //       this.setupUser();
  //     } else {
  //       localStorage.setItem('user', null);
  //     }
  //     this.authSub.next(user);
  //   });

  // observeUser(): Observable<firebase.User> {
  //   return this.authSub.asObservable();
  // }

  isAuthenticated() {
    // return this.user !== null;
  }
  public signInWithPhoneNumber(recaptchaVerifier, phoneNumber) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth
        .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        })
        .catch((error) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
  }
  public async enterVerificationCode(code) {
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult
        .confirm(code)
        .then(async (result) => {
          console.log(result);
          const user = result.user;
          resolve(user);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  isWaitingForFirstAuthEvent(): boolean {
    // return this.firstauthevent;
    return true;
  }

  //getUser(): firebase.User {
  // return this.user;
  //}

  // getUserDataRef(): firebase.firestore.DocumentReference {
  //   const db = firebase.firestore();
  //   return db.collection('userData').doc(this.user.uid);
  // }

  // getAppDataRef(): firebase.firestore.DocumentReference {
  //   const db = firebase.firestore();
  //   return db.collection('appData').doc(this.user.uid);
  // }

  async loginUser() {
    // try {
    //   await firebase.auth().signInWithPopup(new firebase.auth.AuthProvider());
    //   // this.router.navigate(['home'])
    // } catch (e) {
    //   console.log('auth error', e.code, e.message);
    // }
  }

  async logoutUser() {
    // if (this.user) {
    //   await firebase.auth().signOut();
    // }
  }

  async setupUser() {
    // const docref = this.getUserDataRef();
    // let snapshot: firebase.firestore.DocumentSnapshot;
    // try {
    //   snapshot = await docref.get();
    // } catch (err) {
    //   console.error('spazfire', err);
    // }
    // if (!snapshot.exists) {
    //   const newUser: IUserDocument = {
    //     displayName: this.user.displayName,
    //     email: this.user.email,
    //     photoURL: this.user.photoURL,
    //     storeURL: null,
    //   };
    //   // do this quickly
    //   docref.set(newUser);
    //   // now let's see if we can't cache the profile URL
    //   if (this.user.photoURL) {
    //     const resp = await fetch(this.user.photoURL);
    //     const blob = await resp.blob();
    //     const newid = this.tools.makeObjectId();
    //     const storeRef = this.store.ref('user/' + newid);
    //     await storeRef.put(blob, {
    //       customMetadata: {
    //         desc: 'profile picture',
    //         usedin: 'userData/' + this.user.uid,
    //       },
    //     });
    //     const url = await storeRef.getDownloadURL();
    //     await docref.update({ storeURL: url });
    //   }
    // } else {
    //   this.userDocument = snapshot.data() as IUserDocument;
    // }
  }
}
