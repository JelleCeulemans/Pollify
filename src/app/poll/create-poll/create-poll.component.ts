import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Poll } from 'src/app/models/poll.model';
import { Antwoord } from 'src/app/models/antwoord.model';
import { PollService } from 'src/app/poll.service';
import { Observable } from 'rxjs';
import { PollGebruiker } from 'src/app/models/pollgebruiker.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {
  answerList: string[];
  answers: Antwoord[]
  answer: string;
  title: string;
  createPollForm: FormGroup;
  poll: Poll;
  pollGebruiker: PollGebruiker

  constructor(
    private snackbar: MatSnackBar, 
    private pollService: PollService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.answerList = new Array();
    this.answers = new Array<Antwoord>();
    this.createPollForm = new FormGroup({
      title: new FormControl(''),
      answer: new FormControl('')
    })
  }

  addAnswerPoll() {
    this.answer = this.createPollForm.value.answer;
    if (this.answer) {
      if (this.answerList.includes(this.answer)) {
        this.snackbar.open('This answer already exists!', 'Error', {
          duration: 3000
        });
      } else {
        this.answerList.push(this.createPollForm.value.answer);
        this.createPollForm.setValue({
          title: this.createPollForm.value.title,
          answer: ''
        });
      }
    } else {
      this.snackbar.open('Please fill in an answer!', 'Error', {
        duration: 3000
      });
    }

  }

  onSubmit() {
    console.log(this.authService.getGebruiker());
    this.pollGebruiker = new PollGebruiker(0, new Poll(0, "", null, null), this.authService.getGebruiker());
    console.log(new Poll(0, "", null, null));
    console.log(this.pollGebruiker)



    // //console.log(this.authService.getGebruiker());
    // this.title = this.createPollForm.value.title;

    // if (this.title && this.answerList.length > 0) {
    //   this.answerList.forEach(answer => {
    //     this.answers.push(new Antwoord(0, answer, this.poll, null));
    //   });
    //   //console.log(this.authService.getGebruiker());
    //   this.poll = new Poll(0, this.title, [new PollGebruiker(0, this.poll, this.authService.getGebruiker())], this.answers);
    //   console.log(this.poll);
    //   // this.pollService.createPoll(this.poll).subscribe(result => {
    //   //   this.poll = result;
    //   // });
      
    //   this.router.navigate(['/dashboard']);
    // } else {
    //   this.snackbar.open('Title was blank or no answers were added to the poll', 'Error', {
    //     duration: 3000
    //   });
    // }

  }

}
