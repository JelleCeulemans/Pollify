import { Poll } from './poll.model';
import { Vote } from './vote.model';

export class Answer {
    constructor(public answerID: number, public name: string, public poll: Poll, public votes: Vote[]) { }
}