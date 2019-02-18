import { Component, OnInit } from '@angular/core';
import { WordService } from '../word.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  langList: [string];
  selectedLang = '';
  inputLanguage: string;
  inputWord: string;
  wordDocument;

  constructor(
    private wordService: WordService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.refreshLangList();

  }

  addLanguage() {
    this.wordService.addLanguage(this.inputLanguage)
      .subscribe(data => {
        console.log(data);
        this.refreshLangList();
      });
  }

  delWord(list: string, word) {
    console.log(`${list} && ${word}`);
    this.wordService.deleteWord(this.selectedLang, list, word)
      .subscribe(data => {
        console.log(data);
        this.getList();
      });
  }

  addWord() {
    this.wordService.addApprovedWord(this.inputWord, this.selectedLang)
      .subscribe(data => {
        console.log(data);
        this.getList();
        this.inputWord = '';
      });
  }

  approveWord(word: string) {
    this.wordService.approveWord(this.selectedLang, word)
      .subscribe(data => {
        console.log(data);
        this.getList();
      });
  }

  getList() {
    if (this.selectedLang.length > 0) {
      console.log(`Get word list for ${this.selectedLang}`);
      this.wordService.listWords(this.selectedLang)
        .subscribe(data => {
          console.log(data);
          this.wordDocument = data;
          //    this.refreshLangList();
        });
    }
  }

  refreshLangList() {
    this.wordService.listLanguages()
      .subscribe(data => {
        this.langList = data;
        console.log(this.langList);
        // this.selectedLang = this.langList[0];
      });
  }
}
