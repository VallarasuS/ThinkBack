/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import { expect } from "chai";
import * as P from "../src/core/positions"
import * as I from "../src/core/Instruments"
import * as R from "ramda"


describe("P/L for Long Call", () => {

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
    it("When in deep profit, premium is not part of it", () => {
        expect(P.pl(leg, 8600)).to.equal(90);
    });
    it("Profit the same as premium paid", () => {
        leg.price = 100;
        expect(P.pl(leg, 8600)).to.equal(0);
    });
    it("When in deep loss, long call loss is limited to the premium paid", () => {
        leg.price = 10;
        // leg.
        expect(P.pl(leg, 8400)).to.equal(-10);
    });
    it("Premium is your loss, when spot equals strike", () => {
        leg.price = 10;
        // leg.
        expect(P.pl(leg, 8500)).to.equal(-10);
    });
});