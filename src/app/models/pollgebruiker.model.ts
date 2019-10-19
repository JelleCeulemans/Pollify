import { Poll } from './poll.model';
import { Gebruiker } from './gebruiker.model';

export class PollGebruiker {
    constructor(public pollgebruikerID: number, public poll: Poll, public gebruiker: Gebruiker) { }
}