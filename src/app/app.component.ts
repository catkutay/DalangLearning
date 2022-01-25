import { Component } from '@angular/core';
import { AuthenticateService } from './services/auth-service.service';
import { Observable } from 'rxjs';
import { firebaseConfig } from './services/credentials';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet>
        <ion-content class="ion-no-padding">
          <div id="sign-in-button"></div>

          <div class="main">
            <ion-card no-margin>
              <ion-card-content>
                <ion-row class="row">
                  <div class="fire-logo">
                    <img src="../../assets/fire.png" class="img-logo" />
                    <ion-text class="ion-padding">
                      <h2
                        class="ion-no-margin ion-margin-vertical ion-text-center"
                      >
                        Welcome to Ionic 6 Firebase Phone Auth
                      </h2>
                    </ion-text>
                  </div>
                </ion-row>
                <ion-grid class="phoneAuthGrid">
                  <ion-row>
                    <ion-col size="8">
                      <ion-input
                        clearInput
                        type="test"
                        placeholder="Your Contact Number"
                        [(ngModel)]="PhoneNo"
                        class="input ion-padding-horizontal"
                        clear-input="true"
                      ></ion-input>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button
                        expand="block"
                        (click)="signInWithPhoneNumber($event)"
                        color="undefined"
                        class="btn-transition"
                      >
                        Sign in with Phone number</ion-button
                      >
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-card-content>
            </ion-card>
          </div>
        </ion-content>
      </ion-router-outlet>
    </ion-app>
  `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  phoneNo: string;

  OTP: string = '';
  Code: any;
  PhoneNo: any;
  CountryCode: any = '+61';
  showOTPInput: boolean = false;
  OTPmessage: string =
    'An OTP is sent to your number. You should receive it in 15 s';
  // recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  alertController: AlertController;
  confirmationResult: any;
  // user: firebase.User = null;
  //authObs: Observable<firebase.User>;
  constructor(public authService: AuthenticateService) {}

  signinWithPhoneNumber($event) {
    if (this.PhoneNo) {
      //needs
      this.authService
        .signInWithPhoneNumber(null, '+61' + this.PhoneNo)
        .then((success) => {
          this.OtpVerification();
        });
    }
  }
  async showSuccess() {
    const alert = await this.alertController.create({
      header: 'Success',
      buttons: [
        {
          text: 'Ok',
          handler: (res) => {
            alert.dismiss();
          },
        },
      ],
    });
    alert.present();
  }
  async OtpVerification() {
    const alert = await this.alertController.create({
      header: 'Enter OTP',
      backdropDismiss: false,
      inputs: [
        {
          name: 'otp',
          type: 'text',
          placeholder: 'Enter your otp',
        },
      ],
      buttons: [
        {
          text: 'Enter',
          handler: (res) => {
            this.authService.enterVerificationCode(res.otp).then((userData) => {
              this.showSuccess();
              console.log(userData);
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
