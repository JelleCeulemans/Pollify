import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})

//Includes all the calls to the Answer table of the database
export class AnswerService {
  baseURL = environment.baseURL;


  //Make all the necessary services available
  constructor(
      private http: HttpClient,
      private localStorageService: LocalStorageService) {
  }

  //Retrieve all the logged in person answer for a specific poll
  getAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.baseURL + "/Answer/specific?userid=" + this.localStorageService.getUser().userID + "&pollID=" + this.localStorageService.getPollID());
  }

  //Add an answer to a poll
  addAnswer(answer: Answer) {
    return this.http.post<Answer>(this.baseURL + "/Answer/", answer);
  }

  //Remove an answer from a poll
  deleteAnswer(answer: Answer) {
    return this.http.delete<Answer>(this.baseURL + "/Answer/" + answer.answerID);
  }
}