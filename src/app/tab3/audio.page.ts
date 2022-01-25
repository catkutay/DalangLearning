import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { FirestoreService } from '../services/firestore.service';
import { LoadingController, AlertController } from '@ionic/angular';

import { LocalstoreService } from '../services/localstore.service';

import { VoiceRecorder, GenericResponse } from 'capacitor-voice-recorder';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//shared methods with record page, so put into local storage
@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {
  recording = false;
  recordData: any;
  storedFileNames = [];
  public createAudioForm: FormGroup;
  public language: String;
  constructor(
    private firestoreService: FirestoreService,
    public loadingCtrl: LoadingController,
    formBuilder: FormBuilder,
    private localService: LocalstoreService
  ) {
    this.createAudioForm = formBuilder.group({
      language: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadFiles();
    // will print true / false based on the ability of the current device (or web browser) to record audio
    VoiceRecorder.canDeviceVoiceRecord().then((result: GenericResponse) => {
      if (!result.value) VoiceRecorder.requestAudioRecordingPermission();
      //console.log('Recording Permitted: ' + result.value);
    });
  }
  async loadFiles() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data,
    }).then((result) => {
      this.storedFileNames = result.files;
      //console.log(result.files);
    });
  }
  async startRecording() {
    this.language = this.createAudioForm.value.language;
    if (!this.recording) {
      this.recording = true;
      this.localService.startRecording();
    }
    console.log('Started');
  }
  stopRecording() {
    //this.language = this.createAudioForm.value.language;
    
    console.log(this.language);
    const fileName = this.language + '.wav';
    var fileType = 'audio/wav';

    if (this.recording) {
      this.recording = false;
      this.localService.stopRecording(fileName);
    }
    console.log('finished');
    this.loadFiles();
    //list files that exist
  }

  async uploadFile(filename: string) {
    this.firestoreService.uploadFilename(filename);
  }
  async playFile(filename: string) {
    // files not playing on web browser, try on app
    this.localService.playFile (filename);
  }
  // public async playFile(filename: string) {
  //   this.localService.playFile(filename);
  // }
  async deleteFile(filename: string) {
    this.localService.deleteFile(filename);

    this.loadFiles();
  }
}
