import { Poll } from './poll.model';
import { Stem } from './stem.model';

export class Antwoord {
    constructor(public antwoordID: number, public beantwoording: string, poll: Poll, stemmen: Stem[]) { }
}