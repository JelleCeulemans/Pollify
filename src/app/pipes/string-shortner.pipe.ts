import { Pipe, PipeTransform } from '@angular/core';
import { Vote } from '../models/vote.model';

//This pipe transforms an array of votes to a summary of all the user that voted.
@Pipe({name: 'stringShortener'})
export class StringShortenerPipe implements PipeTransform {
  transform(title: string, length: number): string {
      if (title.length > length) {
        title = title.substring(0,length-1) + "...";
      }
    return title;
  }
}