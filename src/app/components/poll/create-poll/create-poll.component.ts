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
export class CreatePollComponent implements OnInit, OnDestroy {
  //Declarations
  answerList: string[];
  answers: Answer[]
  answer: string;
  title: string;
  createPollForm: FormGroup;
  poll: Poll;
  pollUser: PollUser

  //Subscription
  private createPoll: Subscription;
  private createPollUser: Subscription;

  //Make all necessary services available
  constructor(
    private snackbar: MatSnackBar,
    private pollService: PollService,
    private pollUserService: PollUserService,
    private localStorageService: LocalStorageService,
    private router: Router) { }

  //While the component is initializing
  ngOnInit() {
    //Define 2 empty arrays
    this.answerList = new Array();
    this.answers = new Array<Answer>();
    //Create a formgroup with validation rules
    //The title field is required
    this.createPollForm = new FormGroup({
      title: new FormControl('', { validators: [Validators.required] }),
      answer: new FormControl('')
    })
  }

  //Add an answer to the poll
  addAnswerPoll() {
    this.answer = this.createPollForm.value.answer;
    //If the answer is not empty
    if (this.answer) {
      //If the given answer is allready added to the poll
      if (this.answerList.includes(this.answer)) {
        //Show a snackbar that this answer already exist
        this.snackbar.open('This answer already exists!', 'Error', {
          duration: 3000
        });
        //If the given answer is a new answer
      } else {
        //Add the answer to the poll
        this.answerList.push(this.createPollForm.value.answer);
        //Remove the answer from the form
        this.createPollForm.setValue({
          title: this.createPollForm.value.title,
          answer: ''
        });
      }
      //If the answer is empty
    } else {
      //show a snackbar that the is required to fill in an answer
      this.snackbar.open('Please fill in an answer!', 'Error', {
        duration: 3000
      });
    }
  }

  //When the Save the poll button is pressed
  onSubmit() {
    this.title = this.createPollForm.value.title;
    //Check if the poll contains 2 answers
    if (this.answerList.length >= 2) {
      //Make All of them a answer object
      this.answerList.forEach(answer => {
        this.answers.push(new Answer(0, answer, this.poll, null));
      });
      //Create a new poll with the title and answer
      this.poll = new Poll(0, this.title, null, this.answers);
      //Add the poll to the database
      this.createPoll = this.pollService.createPoll(this.poll).subscribe(result => {
        //Add the current user to the poll
        this.createPollUser = this.pollUserService.createPollUser(new PollUser(0, result, this.localStorageService.getUser(), true)).subscribe(result => {
          //navigate to the dashboard
          this.router.navigate(['/dashboard']);
        });
      });
      //If the poll doesn't contains at least 2 answers
    } else {
      this.snackbar.open('Less then 2 answers were added to the poll', 'Error', {
        duration: 3000
      });
    }
  }

  //Remove an answer from the poll
  removeAnswer(answer: string) {
    this.answerList.splice(this.answerList.indexOf(answer), 1);
  }

  //Unsubscribe all subscriptions to avoid data leaksq<
  ngOnDestroy() {
    this.createPoll ? this.createPoll.unsubscribe() : false;
    this.createPollUser ? this.createPollUser.unsubscribe() : false;
  }
}
