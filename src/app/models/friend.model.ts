import { User } from './user.model';

export class Friend {

    constructor(
        public friendID: number,
        public sender: User,
        public receiver: User,
        public accepted: boolean) {}
}