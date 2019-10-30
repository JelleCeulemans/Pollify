import { PollUser } from './poll-user.model';
import { Answer } from './answer.model';

export class Poll {
    constructor(
        public pollID: number, 
        public naam: string,
        public pollUsers: PollUser[],
        public answers: Answer[]) {
    }
}