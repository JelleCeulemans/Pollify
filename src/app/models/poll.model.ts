import { PollGebruiker } from './pollgebruiker.model';
import { Antwoord } from './antwoord.model';

export class Poll {
    constructor(
        public pollID: number, 
        public naam: string,
        public pollgebruiker: PollGebruiker[],
        public antwoorden: Antwoord[]) {
    }
}