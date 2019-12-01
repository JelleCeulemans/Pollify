import { Component, OnInit, OnDestroy } from '@angular/core';
import { PollService } from '../../../services/poll.service';
import { Poll } from 'src/app/models/poll.model';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Vote } from 'src/app/models/vote.model';
import { PollUser } from 'src/app/models/poll-user.model';
import { Answer } from 'src/app/models/answer.model';
import { MatSnackBar } from '@angular/material';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { AnswerService } from 'src/app/services/answer.service';
import { PollUserService } from 'src/app/services/pollUser.service';
import { VoteService } from 'src/app/services/vote.service';
import { EmailService } from 'src/app/services/email.service';


@Component({
  selector: 'app-vote-poll',
  templateUrl: './vote-poll.component.html',
  styleUrls: ['./vote-poll.component.scss']
})
export class VotePollComponent implements OnInit, OnDestroy {
  //Declarations
  poll: Poll;
  answersIDPoll: number[];
  answersIDUser: number[];
  participants$: Observable<User[]>;
  noparticipants$: Observable<User[]>;
  answer: string;
  userID: number;
  showAddAnswer: boolean;
  dataArray: number[];
  labelArray: string[];
  totalVotes: number;

  //Subscriptions
  private getPollByID: Subscription;
  private getAnswers: Subscription;
  private createVote: Subscription;
  private deleteVote: Subscription;
  private createPollUser: Subscription;
  private addAnswerSub: Subscription;
  private deleteAnswerSub: Subscription;
  private deleteParticipant: Subscription;

  //Chart settings
  public doughnutChartLabels: Label[];
  public doughnutChartData: SingleDataSet;
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutColors: Array<any> = [
    { // all colors in order
      backgroundColor: ['#E91E63', '#7B1FA2', '#9E9E9E', '#FFEB3B', '#ffffff', '#009688', '#FFC107', '#F44336', '#03A9F4', '#607D8B', '#000000', '#673AB7', '#3F51B5', '#00BCD4', '#CDDC39', '#FBE9E7', '#795548']
    }];
  public doughnutOptions = {
    legend: false
  }

  //Making all the necessary services available
  constructor(
    private pollService: PollService,
    private pollUserService: PollUserService,
    private answerService: AnswerService,
    private voteService: VoteService,
    private emailService: EmailService,
    private localStorageService: LocalStorageService,
    private snackbar: MatSnackBar) { }

  //While the component is initializing
  ngOnInit() {
    //Define 2 empty arrays
    this.labelArray = new Array<string>();
    this.dataArray = new Array<number>();
    //Set total votes to 0 
    //If the number is greater than 0 the chart is visible
    this.totalVotes = 0;

    //Get the poll by his id in the localStorage
    this.getPollByID = this.pollService.getPollById().subscribe(result => {
      this.poll = result;
      //For each answer object in the poll
      result.answers.forEach(element => {
        //Add name to the chart's label array
        this.labelArray.push(element.name);
        //Add the amount of votes to the chart's data array
        this.dataArray.push(element.votes.length);
        //add the amount of votes to the totalVotes variable
        this.totalVotes += element.votes.length;
      });
    });
    //Add the arrays to the chart
    this.doughnutChartLabels = this.labelArray;
    this.doughnutChartData = this.dataArray;
    //Define 2 empty arrays
    this.answersIDPoll = new Array<number>();
    this.answersIDUser = new Array<number>();
    //Get all the answers with votes from the logged in user
    this.getAnswers = this.answerService.getAnswers().subscribe(result => {
      //Add all answer IDs to the arrays
      result.forEach(element => {
        this.answersIDUser.push(element.answerID);
        this.answersIDPoll.push(element.answerID);
      });
    });
    //Get the users ID from the localStorage to show in the participants section
    this.userID = this.localStorageService.getUser().userID;
    //Get all the users that have a connection to this poll
    this.participants$ = this.pollService.getPollParticipants();
    //Get all friends that are not participanting the poll
    this.noparticipants$ = this.pollService.getPollNoParticipants();
    //Hide the add answer form by default
    this.showAddAnswer = false;
  }

  //Update the votings
  updateVote(event, answer) {
    //If the checbox is checked
    if (event.checked) {
      this.answersIDPoll.push(answer);
      //If the checkbox is unchecked
    } else {
      //Find the answer in the array and remove it
      var index = this.answersIDPoll.indexOf(answer);
      if (index > -1) {
        this.answersIDPoll.splice(index, 1);
      }
    }
  }

  //When the vote button is pressed
  saveVote() {
    let counter = 1;
    //Go trough the list of all answers in the poll
    this.poll.answers.forEach(element => {
      //Create vote is the checkbox is changed fron unchecked to checked
      if (this.answersIDPoll.includes(element.answerID) && !this.answersIDUser.includes(element.answerID)) {
        this.createVote = this.voteService.createVote(new Vote(0, element, this.localStorageService.getUser())).subscribe(result => this.checkEnd(counter++));
        //Remove vote it the checkbox is changed from checked to unchecked
      } else if (!this.answersIDPoll.includes(element.answerID) && this.answersIDUser.includes(element.answerID)) {
        this.deleteVote = this.voteService.deleteVote(element.answerID, this.localStorageService.getUser().userID).subscribe(result => this.checkEnd(counter++));
      } else {
        this.checkEnd(counter++);
      }
    });
  }

  //Reload the page if all the calls were ended
  checkEnd(count: Number) {
    if (count == this.poll.answers.length) {
      this.ngOnInit();
    }
  }

  //Disable en change the text on the invite button from invite to invited
  inviteFriend(user: User, event: any) {
    if (event.target.tagName == "SPAN") {
      event.target.parentElement.disabled = true;
      event.target.innerHTML = "Invited";
    } else if (event.target.tagName == "BUTTON") {
      event.target.disabled = true;
      event.target.firstChild.innerHTML = "Invited";
    }

    //Create add the invited user to a poll and send him an invite mail
    this.createPollUser = this.pollUserService.createPollUser(new PollUser(0, this.poll, user, false)).subscribe(result => {
      //FIXME
      //Send params instead of user object

      //Send a mail to inform that the user had a poll invite
      this.emailService.pollInvite(new User(0, result.user.email, this.poll.name, this.localStorageService.getUser().username, false, '00000000-0000-0000-0000-000000000000', null, null, null)).subscribe();
    });
  }

  //Add an answer to the poll
  addAnswer() {
    //If the poll already contains that answer
    if (this.poll.answers.some(n => n.name == this.answer)) {
      //Show a snackbar that the answer is duplicate
      this.snackbar.open('Duplicate error', 'Error', {
        duration: 3000
      });
      //If the poll doesn't contain the given answer
    } else {
      //Add the answer to the database
      this.addAnswerSub = this.answerService.addAnswer(new Answer(0, this.answer, this.poll, null)).subscribe(result => {
        //reload the page
        this.ngOnInit();
        //clear the answer field
        this.answer = '';
      });
    }
  }

  //Remove an answer from the poll
  deleteAnswer(answer: Answer) {
    //Check if the poll has more than 2 answers
    if (this.poll.answers.length > 2) {
      //Delete the answer in the database
      this.deleteAnswerSub = this.answerService.deleteAnswer(answer).subscribe(result => {
        //reload the component
        this.ngOnInit();
      });
      //If the poll contains only 2 answer a snackbar will be shown
    } else {
      this.snackbar.open('A poll need at least 2 answer, you first have to add an answer to delete one of the remaining', 'Delete error', {
        duration: 3000
      });
    }
  }

  //Remove a participant from a poll
  removeParticipant(participant: User) {
    this.deleteParticipant = this.pollUserService.deleteParticipant(participant.userID, this.poll.pollID).subscribe(result => {
      //reload the component
      this.ngOnInit();
    });
  }

  //Chart events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  //Unsubscribe all subscriptions to avoid data leaks
  ngOnDestroy() {
    this.answersIDPoll = new Array<number>();
    this.getPollByID.unsubscribe();
    this.getAnswers.unsubscribe();
    this.createVote ? this.createVote.unsubscribe() : false;
    this.deleteVote ? this.deleteVote.unsubscribe() : false;
    this.createPollUser ? this.createPollUser.unsubscribe() : false;
    this.addAnswerSub ? this.addAnswerSub.unsubscribe() : false;
    this.deleteAnswerSub ? this.deleteAnswerSub.unsubscribe() : false;
    this.deleteParticipant ? this.deleteParticipant.unsubscribe() : false;
  }
}
