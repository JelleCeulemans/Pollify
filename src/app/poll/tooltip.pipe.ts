import { Pipe, PipeTransform } from '@angular/core';
import { Vote } from '../models/vote.model';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
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