const timesTwo: SpinnerSection = {
    label: '1',
    multiplier: 2,
    color: '#595f69',
    textColor: '#fff'
}
const timesFour: SpinnerSection = {
    label: '3',
    multiplier: 4,
    color: '#0748b5',
    textColor: '#fff'
}
const timesSix: SpinnerSection = {
    label: '5',
    multiplier: 6,
    color: '#8c0dd1',
    textColor: '#fff'
}
const timesEleven: SpinnerSection = {
    label: '10',
    multiplier: 11,
    color: '#f09d05',
    textColor: '#000'
}
const timesTwenty: SpinnerSection = {
    label: '20',
    multiplier: 20,
    color: '#c91616',
    textColor: '#000'
}

export class Spinner {
    public sections: Array<SpinnerSection> = [
        timesTwenty,
        timesTwo,
        timesFour,
        timesTwo,
        timesSix,
        timesTwo,
        timesFour,
        timesTwo,
        timesEleven,
        timesTwo,
        timesFour,
        timesTwo,
        timesSix,
        timesTwo,
        timesSix,
        timesTwo,
        timesFour,
        timesTwo,
        timesEleven,
        timesTwo,
        timesFour,
        timesTwo,
        timesSix,
        timesTwo,
        timesFour,
        timesTwo,
    ]

    private bets: Map<sectionLabel, Bet> = new Map();

    constructor() {
        for(let s of [timesTwo, timesFour, timesSix, timesEleven, timesTwenty]) {
            this.bets.set(s.label, new Bet(s))
        }
    }

    placeBet(userBet: BetOptions) {
        let bet = this.bets.get(userBet.bet)!;

        let user = bet.userBets.get(userBet.uid);

        if(user) {
            user.amount += userBet.amount;
            bet.userBets.set(userBet.uid, user);
        } else {
            bet.userBets.set(userBet.uid, {
                uid: userBet.uid,
                username: userBet.username,
                amount: userBet.amount
            })
        }
    }

    findStartAngle(options: FindStartOptions) {
        let { winner, velocity, velCut, drag } = options;
        let testVel = velocity;
        let snap = 360 / this.sections.length;
        let targetAngle = -((winner) * snap);
        
        while(testVel > velCut){
            let radians = this.degrees_to_radians(targetAngle);
            testVel -= testVel * drag;
            radians += testVel * .166;
            targetAngle = this.radians_to_degrees(radians);
        }
        let rSnap = Math.random() * snap - snap / 2;
        // let rSnap = 0;
        let randomness = this.clamp(rSnap, -snap/2 + .1, snap/2 - .1);
        let predictedStartAngle = (360 - targetAngle % 360) + randomness;    
        return predictedStartAngle;
    }

    radians_to_degrees(radians: number){
        return radians * (180/Math.PI);
    }

    degrees_to_radians(degrees: number){
        return degrees * (Math.PI/180);
    }

    clamp(value: number, min: number, max: number){
        return Math.min(Math.max(value ,min) , max);
    }

    toState(): SpinnerState {
        return {
            sections: this.sections,
            bets: Object.fromEntries(Array.from(this.bets.entries()).map(([l, b]) => {return [l, b.toState()]}))
        }
    }
}

export type sectionLabel = '1' | '3' | '5' | '10' | '20';

export interface FindStartOptions {
    winner: number;
    velocity: number;
    velCut: number;
    drag: number;
}

export interface SpinnerSection {
    label: sectionLabel;
    multiplier: number;
    sub?: string;
    color?: string;
    textColor?: string;
    icon?: string;
}

export interface BetOptions {
    uid: string;
    username: string;
    bet: sectionLabel;
    amount: number;
}

class Bet {
    userBets: Map<string, UserBet> = new Map();
    get totalPayout() {
        return Array.from(this.userBets.values()).reduce<number>((p, c) => {
            return p + (c.amount * this.options.multiplier);
        }, 0);
    }
    constructor(public options: SpinnerSection) {}

    toState(): BetState {
        return {
            label: this.options.label,
            userBets: Array.from(this.userBets.values())
        }
    }
}

interface UserBet {
    uid: string;
    username: string;
    amount: number;
}

export interface SpinnerState {
    sections: Array<SpinnerSection>;
    bets: {
        [key: string]: BetState;
    }
}

export interface BetState {
    label: sectionLabel;
    userBets: Array<UserBet>;
}