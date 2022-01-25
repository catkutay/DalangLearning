import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Word } from '../models/word.interface';
import { FirestoreService } from '../services/firestore.service';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { LocalstoreService } from '../services/localstore.service';
import {
  VoiceRecorder,
  VoiceRecorderPlugin,
  RecordingData,
  GenericResponse,
  CurrentRecordingStatus,
} from 'capacitor-voice-recorder';

//page to record or re-record the audio for existing word
//Shared methods with Tab3, hence placed in local storage service
@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordItem implements OnInit {
  recording = false;
  public word: Word;
  private storedFileNames: string[];
  constructor(
    private firestoreService: FirestoreService,

    private route: ActivatedRoute,
    private localService: LocalstoreService
  ) {
    this.storedFileNames = new Array<string>();
  }

  ngOnInit() {
    const wordId: string = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getWordDetail(wordId).subscribe((word) => {
      this.word = word;
    });

    // will print true / false based on the ability of the current device (or web browser) to record audio
    VoiceRecorder.canDeviceVoiceRecord().then((result: GenericResponse) =>
      console.log('Can Record: ', result.value)
    );
    VoiceRecorder.requestAudioRecordingPermission();
    this.localService.loadFiles;
  }

  startRecording() {
    //local recording
    if (!this.recording) {
      this.recording = true;
      this.localService.startRecording();
    }
  }
  async deleteFile(filename: string) {
    console.log(filename);
    this.localService.deleteFile(filename);

    this.localService.loadFiles();
  }

  async uploadFile(filename: string) {
    this.firestoreService.uploadFilename(filename);
  }
  displayFile(filename: string) {
    //display file if exists
  }
  stopRecording(filename: string) {
    //stop and local save

    if (this.recording) {
      this.recording = false;
      this.localService.stopRecording(filename);
      this.storedFileNames = this.localService.storedFileNames;
    }

    //need to refresh page
  }
  findFile(filename: string) {
    //called from inteface to see if file exists
    for (let fileN of this.storedFileNames) {
      if (filename == fileN) return true;
    }
    return false;
  }
  async playFile(filename: string) {
    this.localService.playFile(filename);
  }
}
