import { PollUser } from './poll-user.model';
import { Vote } from './vote.model';

export class User {
    constructor(
        public userID: number, 
        public email: string, 
        public password: string, 
        public username: string,
        public pollUsers: PollUser[],
        public votes: Vote[],
        public token: string) { }
}