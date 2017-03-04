/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import { expect } from "chai";
import * as DomUtil from "./domutils";
import * as state from "../src/appstate";
import * as datetime from "../src/core/datetime"


describe("Initial App state is correct", () => {
  it("should load dataset", () => {
    console.log(datetime.tsToDateStr(1477526400000));
    console.log(datetime.toDate("20161027").valueOf());
  });
});

