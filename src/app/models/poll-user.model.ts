import { Poll } from './poll.model';
import { User } from './user.model';

export class PollUser {
    constructor(public pollUserID: number, public poll: Poll, public user: User, public accepted: boolean) { }
}