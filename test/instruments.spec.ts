/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import { expect } from "chai";
import * as DomUtil from "./domutils";
import * as fs from "fs";
import * as ins from "../src/core/instruments"
import * as R from "ramda"

const mockdata: string = fs.readFileSync("test//20161031.json", "utf-8");

function loadTestData(): [Instrument] {
  return JSON.parse(mockdata);
}

describe("Instruments Domain functions", () => {
  const testData = loadTestData();
  it("should load instruments ", () => {
    expect(testData.length).to.equal(3901);
  });
  it("should determine instrument of type index correctly ", () => {
    const filter = (i: Instrument) => i.type === 0;
    const indexOnlyRecords = R.filter(filter, testData)
    const isAllIndex = R.all(ins.isIndex, indexOnlyRecords);
    expect(isAllIndex).to.equal(true);
    expect(indexOnlyRecords.length).to.equal(19);
  });
  it("should determine instrument of type future correctly ", () => {
    const filter = (i: Instrument) => i.type === 1 || i.type === 4;
    const futureOnlyRecords = R.filter(filter, testData)
    const isAllFutures = R.all(ins.isFuture, futureOnlyRecords);
    expect(isAllFutures).to.equal(true);
    expect(futureOnlyRecords.length).to.equal(57);
  });
  it("should determine instrument of type CALL options correctly ", () => {
    const filter = (i: Instrument) => i.type === 2;
    const CEOnlyRecords = R.filter(filter, testData)
    const isAllCE = R.all(ins.isCE, CEOnlyRecords);
    expect(isAllCE).to.equal(true);
    expect(CEOnlyRecords.length).to.equal(1984);
  });
  it("should determine instrument of type PUT options correctly ", () => {
    const filter = (i: Instrument) => i.type === 3;
    const CEOnlyRecords = R.filter(filter, testData)
    const isAllCE = R.all(ins.isPE, CEOnlyRecords);
    expect(isAllCE).to.equal(true);
    expect(CEOnlyRecords.length).to.equal(1822);
  });
  it("should determine instrument of type VIX options correctly ", () => {
    const filter = (i: Instrument) => i.type === 5;
    const vixRecords = R.filter(filter, testData)
    const isAllVix = R.all(ins.isVix, vixRecords);
    expect(isAllVix).to.equal(true);
    expect(vixRecords.length).to.equal(19);
  });
});
describe("Dummy main", () => {
  const testData = [
  {strike: 8000, type: ins.InstrumentType.CE},
  {strike: 8000, type: ins.InstrumentType.PE},
  {strike: 8100, type: ins.InstrumentType.CE},
  {strike: 8200, type: ins.InstrumentType.PE},
  {strike: 8300, type: ins.InstrumentType.PE},
  {strike: 8300, type: ins.InstrumentType.CE}];
  /** it("dummy main ", () => {
    const expected = ins.toOptionsPair(testData);
    // console.log(expected);
    expect(expected.length).to.equal(4);
  });**/
});