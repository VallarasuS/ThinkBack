import * as R from "ramda";
import * as I from "./instruments";

export enum PositionType { Long, Short}
export interface PositionLeg{
    type: PositionType,
    instrument: Instrument,
    price: number,
    lots: number,
    trade_date?: number
}

export interface Position {
    legs: [PositionLeg]
}

export function test(){
    return 1;
}

function capLoss (actuals: number, maxLoss: number): number{
    return actuals >=0 ? actuals : (0 - maxLoss);
}

function capProfit (actuals: number, maxProfit: number): number{
    return actuals >=maxProfit ? maxProfit : actuals;
}

export function pl (leg: PositionLeg, spotPrice: number): number{
    if(leg.type === PositionType.Long && I.isCE(leg.instrument)){
        const actualPL = spotPrice - leg.instrument.strike - leg.price;
        return capLoss (actualPL, leg.price);
    }
    return 1;
}