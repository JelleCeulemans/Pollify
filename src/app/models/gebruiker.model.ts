import { PollGebruiker } from './pollgebruiker.model';
import { Stem } from './stem.model';

export class Gebruiker {
    constructor(
        public gebruikerID: number, 
        public email: string, 
        public wachtwoord: string, 
        public gebruikersnaam: string,
        public pollgebruikers: PollGebruiker[],
        public stemmen: Stem[],
        public token: string) { }
}