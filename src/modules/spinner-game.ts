import { BetOptions, Spinner, SpinnerState } from "./spinner";
const spinInterval = 60000;
const gameDelay = 10000;
export class SpinnerGame {
    nextSpin: Date = new Date();
    running: boolean = false;
    spinner!: Spinner;

    constructor() {
        this.prepareGame();
    }

    interval?: NodeJS.Timeout;

    prepareGame() {
        this.nextSpin = new Date(new Date().getTime() + spinInterval);
        this.spinner = new Spinner();
        this.running = false;
        console.log('New Game Started');
        
        let at = spinInterval / 1000;
        this.interval = setInterval(() => {
            if(at <= 10 && at > 0) {
                console.log('Seconds Left:', at);
            } else if(at > 0 && at > 10 && at % 60 == 0) {
                console.log('Minutes Left:', at / 60);
            } else if(at <= 0) {
                clearInterval(this.interval);
            }
            at--;
        }, 1000);

        setTimeout(() => {
            this.running = true;
            this.resolveSpin();
        }, spinInterval + 1000);
    }

    async resolveSpin() {
        let winner = await this.findWinner();
        let velocity = 1;
        let drag = .005;
        let velCut = .005;
        let angle = this.spinner.findStartAngle({
            winner,
            velocity,
            drag,
            velCut
        });

        let gameSettings = {
            angle,
            velocity,
            drag,
            windup: .01,
            velCut
        }
        // emit game settings and run

        console.log('complete', gameSettings, this.spinner.sections[winner]);
        console.log('Next game in 10 seconds');
        
        setTimeout(() => {
            this.prepareGame();
        }, gameDelay);
    }

    async findWinner(): Promise<number> {
        let winner = Math.floor(Math.random() * this.spinner.sections.length);
        // payout winners
        return winner;
    }

    async placeBet(userBet: BetOptions) {
        if(this.running) throw new Error('Game Running');
        else this.spinner.placeBet(userBet);
    }

    toState(): SpinnerGameState {
        return {
            nextSpin: this.nextSpin.toISOString(),
            running: this.running,
            spinner: this.spinner.toState()
        }
    }
}

export interface SpinnerGameState {
    nextSpin: Date | string;
    running: boolean;
    spinner: SpinnerState
}