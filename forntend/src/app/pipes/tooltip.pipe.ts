import { Pipe, PipeTransform } from '@angular/core';
import { Vote } from '../models/vote.model';

//This pipe transforms an array of votes to a summary of all the user that voted.
@Pipe({name: 'votingUsers'})
export class VotingUsersPipe implements PipeTransform {
  transform(votes: Vote[]): string {
      let tooltip = "";
      votes.forEach((vote, index) => {
        tooltip += vote.user.username;
        if (index < votes.length-1) {
            tooltip  += ", ";
        }
      });
    return tooltip;
  }
}