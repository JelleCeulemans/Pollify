import { Poll } from './poll.model';
import { Gebruiker } from './gebruiker.model';

export class PollGebruiker {
    constructor(public pollgebruikerID: number, poll: Poll, gebruiker: Gebruiker) { }
}