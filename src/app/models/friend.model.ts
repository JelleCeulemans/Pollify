import { Gebruiker } from './gebruiker.model';

export class Friend {

    constructor(
        public friendID: number,
        public sender: Gebruiker,
        public receiver: Gebruiker,
        public accepted: boolean) {}
}