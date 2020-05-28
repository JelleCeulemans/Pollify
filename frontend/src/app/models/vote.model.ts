import { User } from './user.model';
import { Answer } from './answer.model';

export class Vote {
    constructor(
        public voteID: number,
        public answer: Answer,
        public user: User) {
    }
}