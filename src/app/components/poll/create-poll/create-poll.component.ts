import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Poll } from 'src/app/models/poll.model';
import { Router } from '@angular/router';
import { Answer } from 'src/app/models/answer.model';
import { PollUser } from 'src/app/models/poll-user.model';
import { PollService } from '../../../services/poll.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { PollUserService } from 'src/app/services/pollUser.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {
  //Declarations
  answerList: string[];
  answers: Answer[]
  answer: string;
  title: string;
  createPollForm: FormGroup;
  poll: Poll;
  pollUser: PollUser


  //Make all necessary services available
  constructor(
    private snackbar: MatSnackBar, 
    private pollService: PollService,
    private pollUserService: PollUserService,
    private localStorageService: LocalStorageService,
    private router: Router) { }

  ngOnInit() {
    this.answerList = new Array();
    this.answers = new Array<Answer>();
    this.createPollForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required] }),
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
    this.title = this.createPollForm.value.title;
    if (this.answerList.length >= 2) {
      this.answerList.forEach(answer => {
        this.answers.push(new Answer(0, answer, this.poll, null));
      });
      this.poll = new Poll(0, this.title, null, this.answers);
      this.pollService.createPoll(this.poll).subscribe(result => {
        this.poll = result;
        this.pollUserService.createPollUser(new PollUser(0, result, this.localStorageService.getUser(), true)).subscribe(result => {
          this.router.navigate(['/dashboard']);
        });
      });
    } else {
      this.snackbar.open('Title was blank or less then 2 answers were added to the poll', 'Error', {
        duration: 3000
      });
    }
  }

  removeAnswer(answer: string) {
    this.answerList.splice(this.answerList.indexOf(answer), 1);
  }
}
