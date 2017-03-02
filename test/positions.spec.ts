/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import { expect } from "chai";
import * as P from "../src/core/positions"
import * as I from "../src/core/Instruments"
import * as R from "ramda"

const mock = function (longOrShort: 0|1): P.PositionLeg {
    return {
        price: 10,
        type: longOrShort,
        lots: 1,
        instrument: {
            close: 1, open: 1, low: 1, high: 0,
            type: I.InstrumentType.CE, strike: 8500,
            trade_date: 1, expiry: 1, name: "sd", oi: 1, underlying: "a", volume: 0
        }
    }
}
const mockPE = function (longOrShort: 0|1): P.PositionLeg {
    return {
        price: 10,
        type: longOrShort,
        lots: 1,
        instrument: {
            close: 1, open: 1, low: 1, high: 0,
            type: I.InstrumentType.PE, strike: 8500,
            trade_date: 1, expiry: 1, name: "sd", oi: 1, underlying: "a", volume: 0
        }
    }
}
describe("P/L for Long Call", () => {
    it("When in deep profit, premium is not part of it", () => {
        expect(P.PL(mock(0), 8600)).to.equal(90);
    });
    it("Profit the same as premium paid", () => {
        const leg = mock(0);
        leg.price = 100;
        expect(P.PL(leg, 8600)).to.equal(0);
    });
    it("When in deep loss, long call loss is limited to the premium paid", () => {
        const leg = mock(0);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8400)).to.equal(-10);
    });
    it("Premium is your loss, when spot equals strike", () => {
        const leg = mock(0);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8500)).to.equal(-10);
    });
});
describe("P/L for Short Call", () => {
    it("When in deep profit, profit is still the premium", () => {
        expect(P.PL(mock(1), 8300)).to.equal(10);
    });
    it("Premium is your profit, when spot equals strike", () => {
        const leg = mock(1);
        leg.price = 100;
        expect(P.PL(leg, 8500)).to.equal(100);
    });
    it("When in deep loss, loss doesnt include premium", () => {
        const leg = mock(1);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8700)).to.equal(-190);
    });
    it("When spot is x points away from strike, where x was the premium paid", () => {
        const leg = mock(1);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8490)).to.equal(10);
    });
});
describe("P/L for Long Put", () => {
    it("When in deep profit, premium is not part of it", () => {
        expect(P.PL(mockPE(0), 8400)).to.equal(90);
    });
    it("Profit the same as premium paid", () => {
        const leg = mockPE(0);
        leg.price = 100;
        expect(P.PL(leg, 8400)).to.equal(0);
    });
    it("When in deep loss, long call loss is limited to the premium paid", () => {
        const leg = mockPE(0);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8600)).to.equal(-10);
    });
    it("Premium is your loss, when spot equals strike", () => {
        const leg = mockPE(0);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8500)).to.equal(-10);
    });
});

describe("P/L for Short Put", () => {
    it("When in deep profit, profit is still the premium", () => {
        expect(P.PL(mockPE(1), 8700)).to.equal(10);
    });
    it("Premium is your profit, when spot equals strike", () => {
        const leg = mockPE(1);
        leg.price = 100;
        expect(P.PL(leg, 8500)).to.equal(100);
    });
    it("When in deep loss, loss doesnt include premium", () => {
        const leg = mockPE(1);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8300)).to.equal(-190);
    });
    it("When spot is x points away from strike, where x was the premium paid", () => {
        const leg = mockPE(1);
        leg.price = 10;
        // leg.
        expect(P.PL(leg, 8510)).to.equal(10);
    });
});


describe("P/L for Long Call positions", () => {

    const leg: P.PositionLeg = {
        price: 10,
        type: 0,
        lots: 1,
        instrument: {
            close: 1, open: 1, low: 1, high: 0,
            type: I.InstrumentType.CE, strike: 8500,
            trade_date: 1, expiry: 1, name: "sd", oi: 1, underlying: "a", volume: 0
        }
    }
    const leg1: P.PositionLeg = {
        price: 10,
        type: 0,
        lots: 1,
        instrument: {
            close: 1, open: 1, low: 1, high: 0,
            type: I.InstrumentType.CE, strike: 8400,
            trade_date: 1, expiry: 1, name: "sd", oi: 1, underlying: "a", volume: 0
        }
    }
    it("P/L for long call position", () => {
        expect(P.positionPL({ legs: [leg, leg1] }, 8700)).to.equal(480);
    });
    it("P/L for long and short calls", () => {
        leg1.type = 1;
        expect(P.positionPL({ legs: [leg, leg1] }, 8700)).to.equal((190 - 290));
    });
});