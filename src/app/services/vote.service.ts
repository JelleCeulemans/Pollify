import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Vote } from '../models/vote.model';



@Injectable({
    providedIn: 'root'
})
//Includes all the calls to the Vote table of the database
export class VoteService {
    //declaration
    baseURL = environment.baseURL;

    //Make all the necessaty services available
    constructor(private http: HttpClient) {
    }

    //Create a vote in the database
    createVote(vote: Vote) {
        return this.http.post<Vote>(this.baseURL + "/Vote", vote);
    }

    //Delete a vote from the database
    deleteVote(answerID: number, userID: number) {
        return this.http.delete<Vote>(this.baseURL + "/Vote?answerid=" + answerID + "&userid=" + userID);
    }
}