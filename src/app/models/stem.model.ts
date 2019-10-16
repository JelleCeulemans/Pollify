import { Antwoord } from './antwoord.model';
import { Gebruiker } from './gebruiker.model';

export class Stem {
    constructor(
        public stemID: number,
        public antwoord: Antwoord,
        public gebruiker: Gebruiker) {

    }
}