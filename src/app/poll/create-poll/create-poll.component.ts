import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/poll.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Answer } from 'src/app/models/answer.model';
import { PollUser } from 'src/app/models/poll-user.model';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {
  answerList: string[];
  answers: Answer[]
  answer: string;
  title: string;
  createPollForm: FormGroup;
  poll: Poll;
  pollUser: PollUser

  constructor(
    private snackbar: MatSnackBar, 
    private pollService: PollService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.answerList = new Array();
    this.answers = new Array<Answer>();
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
    this.title = this.createPollForm.value.title;
    if (this.title && this.answerList.length >= 2) {
      this.answerList.forEach(answer => {
        this.answers.push(new Answer(0, answer, this.poll, null));
      });
      this.poll = new Poll(0, this.title, [new PollUser(0, this.poll, this.authService.getUser())], this.answers);
      this.pollService.createPoll(this.poll).subscribe(result => {
        this.poll = result;
        console.log(result);
        this.pollService.createPollUser(new PollUser(0, result, this.authService.getUser())).subscribe(result => {
          console.log(result);
          this.router.navigate(['/dashboard']);
        });
      });
    } else {
      this.snackbar.open('Title was blank or less then 2 answers were added to the poll', 'Error', {
        duration: 3000
      });
    }
  }
}
