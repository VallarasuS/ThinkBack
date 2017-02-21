/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import { expect } from "chai";
import * as DomUtil from "./domutils";
import * as fs from "fs";
import * as ins from "../src/core/instruments";
import * as DS from "../src/core/datastore";
import * as R from "ramda"

const mockdata: string = fs.readFileSync("test//20161031.json", "utf-8");

function loadTestData(): [Instrument] {
  return JSON.parse(mockdata);
}

describe("DataStore Domain functions", () => {
  const store = DS.DataStore.getInstance();

  it("should handle empty datastore", () => {
    expect(store.byTradeDate(1475452800000))
      .to.not.equal(undefined);
    expect(store.byTradeDate(1475452800000).length)
      .to.equal(0);
    expect(store.isEmptyOnDate(1475452800000))
      .to.equal(true);
    expect(store.findExpiriesForDate(1475452800000).length)
      .to.equal(0);
  });


  it("should load instruments ", () => {
    store.add(mockdata);
    expect(store.size()).to.equal(3901);
  });

  it("should filter instruments by trade date", () => {
    expect(store.byTradeDate(1475452800000))
      .to.not.equal(undefined);
    expect(store.byTradeDate(1475452800000).length)
      .to.equal(190);
    expect(store.isEmptyOnDate(1475452800000))
      .to.equal(false);
    // Non existent
    expect(store.isEmptyOnDate(1475452800001))
      .to.equal(true);
    expect(store.findExpiriesForDate(1475452800000))
      .to.not.equal(undefined);
  });

});

/**describe("DataStore Filter functions", () => {
  const store = DS.DataStore.getInstance();
  store.add(mockdata);
  it("should filter instruments by trade date", () => {
    expect(store.byTradeDate(1475452800000))
      .to.not.equal(undefined);
    expect(store.byTradeDate(1475452800000).length)
      .to.equal(190);
    expect(store.isEmptyForDate(1475452800000))
      .to.equal(false);
    // Non existent
    expect(store.isEmptyForDate(1475452800001))
      .to.equal(true);
    expect(store.findExpiriesForDate(1475452800000))
      .to.not.equal(undefined);
  });
});**/

describe("DataStore Negative Cases", () => {
  const store = DS.DataStore.getInstance();
  // store.reset();
  /** it("should handle empty datastore", () => {
     expect(store.byTradeDate(1475452800000))
       .to.not.equal(undefined);
     expect(store.byTradeDate(1475452800000).length)
       .to.equal(0);
     expect(store.isEmptyForDate(1475452800000))
       .to.equal(true);
     expect(store.findExpiriesForDate(1475452800000).length)
       .to.equal(0);
   });**/
});