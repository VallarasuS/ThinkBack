import * as R from "ramda"

const nearestHundred = (val: number): number => Math.ceil(val * 100) / 100;
export enum InstrumentType { Index, IndexFuture, CE, PE, StockFuture, VIX };

export const isIndex = (ins: Instrument): boolean => ins.type === InstrumentType.Index;
export const isIdxFuture = (ins: Instrument): boolean => ins.type === InstrumentType.IndexFuture;
export const isStkFuture = (ins: Instrument): boolean => ins.type === InstrumentType.StockFuture;
export const isFuture = (ins: Instrument): boolean => isIdxFuture(ins) || isStkFuture(ins);

export const isCE = (ins: Instrument): boolean => ins.type === InstrumentType.CE;
export const isPE = (ins: Instrument): boolean => ins.type === InstrumentType.PE;
export const isOption = (ins: Instrument): boolean => isCE(ins) || isPE(ins);

export const isVix = (ins: Instrument): boolean => ins.type === InstrumentType.VIX;

export const optionsChainStrikeRange = (index: Instrument, limit: number): OptionsRange => {
    const indexClosing = index.close;
    return {
        lowerStrike: nearestHundred(indexClosing - limit),
        upperStrike: nearestHundred(indexClosing + limit)
    }
}
export const toOptionsPair = (options: [Instrument]): [OptionsPair] => {
    const pairs: any = [];
    let currentPair: OptionsPair = undefined;
    let currentStrike: number = options[0].strike;

    for (let i = 0; i < options.length; i++) {
        if (options[i].strike !== currentStrike) {
            pairs.push(currentPair);
            currentPair = { ce: undefined, pe: undefined }
        }
        if (!currentPair) {
            currentPair = { ce: undefined, pe: undefined }
        }
        if (options[i].type === InstrumentType.CE) {
            currentPair.ce = options[i];
        }
        else if (options[i].type === InstrumentType.PE) {
            currentPair.pe = options[i];
        }
        currentStrike = options[i].strike;
    }
    if (currentPair) {
        pairs.push (currentPair);
    }
    return pairs;
}