import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ActivatedRoute, Router } from '@angular/router';
import { Word } from '../models/word.interface';
import { FirestoreService } from './firestore.service';
import { AlertController } from '@ionic/angular';
// only 'VoiceRecorder' is mandatory, the rest is for typing

//all local methods used by Record, Detail pages and Tab 3
import {
  VoiceRecorder,
  VoiceRecorderPlugin,
  RecordingData,
  GenericResponse,
  CurrentRecordingStatus,
} from 'capacitor-voice-recorder';

@Injectable({
  providedIn: 'root',
})
export class LocalstoreService {
  public word: Word;
  public storedFileNames = [];
  fileforSending;
  fileUri: string;
  filePath: string;
  fileName: string;
  fileType: string;
  entry;
  constructor(
    private af: AngularFireStorage,
    private firestoreService: FirestoreService,
    private alertController: AlertController,

    private route: ActivatedRoute,
    private router: Router
  ) {}
  startRecording() {
    VoiceRecorder.startRecording();
    console.log('Starting');
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
  async deleteFile(filename: string) {
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
    console.log('Local Delete');
    this.firestoreService.deleteFile(filename);
  }
  async uploadFiles(filename: string) {
    //upload from storage on phone-not used
    Filesystem.readdir({
      path: '',
      directory: Directory.Data,
    }).then((result) => {
      console.log(result);
    });
  }

  stopRecording(filename: string): Observable<void> {
    var recordData: any;

    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        recordData = result.value.recordDataBase64;

        await Filesystem.writeFile({
          path: filename,
          directory: Directory.Data,
          data: recordData,
        });
        this.loadFiles();
      }
    });
    return null;
  }
  async playFile(filename: string) {
    // files not playing on web browser, try on app
    const audioFile = await Filesystem.readFile({
      path: filename,
      directory: Directory.Data,
    });
    const mimeType = 'audio/wav';
    const base64Sound = audioFile.data;

    const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }
}

export { LocalstoreService as ExportedClass };
