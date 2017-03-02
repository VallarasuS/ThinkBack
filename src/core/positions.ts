import * as R from "ramda";
import * as I from "./instruments";

export enum PositionType { Long, Short }

export interface PositionLeg {
    type: PositionType
    instrument: Instrument
    price: number,
    lots: number,
    trade_date?: number
}
export interface Position {
    legs: [PositionLeg]
}

export function test() {
    return 1;
}
function capLoss(actuals: number, maxLoss: number): number {
    return actuals >= 0 ? actuals : (0 - maxLoss);
}

function capProfit(actuals: number, maxProfit: number): number {
    return actuals >= maxProfit ? maxProfit : actuals;
}

export function PL(leg: PositionLeg, spotPrice: number): number {
    if (leg.type === PositionType.Long) {
        const actualPL = I.isCE(leg.instrument) ?
            (spotPrice - leg.instrument.strike - leg.price)
            : (leg.instrument.strike - spotPrice - leg.price)
        return capLoss(actualPL, leg.price);
    }
    else {// short position
        const actualPL = I.isCE(leg.instrument) ?
            (leg.price + (leg.instrument.strike - spotPrice))
            : leg.price + (spotPrice - leg.instrument.strike)
        return capProfit(actualPL, leg.price);
    }
}
const add = function (a: number, b: number) {
    return a + b;
};

export function positionPL(position: Position, spotPrice: number): number {
    let pl = 0;
    for (let i = 0; i < position.legs.length; i++) {
        pl += PL(position.legs[i], spotPrice);
    }
    return pl;
}