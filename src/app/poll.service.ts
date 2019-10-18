import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PollGebruiker } from './models/pollgebruiker.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private http: HttpClient) {
    
   }

   getPollGebruikers(PollGebruikerID: number): Observable<PollGebruiker[]> {
    return this.http.get<PollGebruiker[]>("https://localhost:44389/api/PollGebruiker/" + PollGebruikerID);
  }

}
