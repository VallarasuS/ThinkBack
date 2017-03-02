/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import { expect } from "chai";
import * as R from "ramda"
// import {BS, BSHolder} from "../src/thirdparty/blackscholes";

const bs = require("../src/thirdparty/blackscholes");



describe("Option Greeks: ", () => {
    it("Option1Greeks are generated nicely", () => {
        const bsh: any = <BSHolderPort>(new bs.BSHolder(8907, 8950, 0.07, 0.12, (2 / 365)));
        const greeks = bs.BS.call(bsh);
        console.log(greeks);
        expect(greeks).to.equal(90);
    });

});