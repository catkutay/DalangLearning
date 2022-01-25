import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Word } from '../models/word.interface';
import { FirestoreService } from '../services/firestore.service';

import { Plugins } from '@capacitor/core';
const { FilePicker, FilePickerResult } = Plugins;
//Pages to add details for a word from database, links to recording page
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public word: Word;
  private storedFileNames: string[];
  constructor(
    private alertController: AlertController,

    private firestoreService: FirestoreService,
    private route: ActivatedRoute,

    private router: Router
  ) {
    this.storedFileNames = new Array<string>();
  }

  ngOnInit() {
    const wordId: string = this.route.snapshot.paramMap.get('id');
    //console.log(wordId);
    this.firestoreService.getWordDetail(wordId).subscribe((word) => {
      this.word = word;

      if (this.word.audio == null) this.linkAudio();
    });
  }
  linkAudio() {
    //find local audio of same name as language word and link to word
    Filesystem.readdir({
      path: '',
      directory: Directory.Data,
    }).then((result) => {
      this.storedFileNames = result.files;

      for (let fileString of this.storedFileNames) {
        if (fileString == this.word.language + '.wav') {
          //assign file

          this.word.audio = fileString;
          //update in cloud
          this.firestoreService.updateWord(
            this.word.id,
            this.word.english,
            this.word.language,
            this.word.example,
            this.word.partOfSpeech,
            this.word.audio
          );
        }
      }
    });
  }
  async updateWord() {
    //Used when add audio file to update on firebase database
    this.firestoreService.updateWord(
      this.word.id,
      this.word.english,
      this.word.language,
      this.word.example,
      this.word.partOfSpeech,
      this.word.audio
    );
    var filename = this.word.audio;
   
        this.firestoreService.uploadFilename(filename);

        console.log('Uploaded Recording: ' + filename);
      
  }
  async readAudio(filename: string) {
    //Select audio file of same name as langauge word, if exists
    //Not used yet
    FilePicker.showFilePicker({
      fileTypes: ['audio/*', 'application/audio'],
    }).then(
      (fileResult: typeof FilePickerResult) => {
        const fileUri = fileResult.uri;
        const fileName = fileResult.name;
        const fileMimeType = fileResult.mimeType;
        const fileExtension = fileResult.extension;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  async deleteWord(wordId: string, language: string): Promise<void> {
    //deleteing word from wordlist and firebase database
    const alert = await this.alertController.create({
      message: `Are you sure you want to delete ${language}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (language) => {
            console.log('Confirm Cancel: '+language);
          },
        },
        {
          text: 'Okay',
          handler: () => {
            //return to home page
            this.firestoreService.deleteWord(wordId).then(() => {
              this.router.navigateByUrl('');
            });
          },
        },
      ],
      //FIXME add delete sound file if linked
    });

    await alert.present();
  }
  async recordFile() {
    //From interface to record audio for word
    this.router.navigateByUrl('/record/' + this.word.id);
  }
  async playFile(filename) {
    //from interface play file
    console.log('File: ' + filename);
    await Filesystem.readFile({
      path: filename,
      directory: Directory.Data,
    }).then((audioFile) => {
      const mimeType = 'audio/wav';
      const base64Sound = audioFile.data;
      const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`);
      audioRef.oncanplaythrough = () => audioRef.play();
      audioRef.load();
    });
  }
}
