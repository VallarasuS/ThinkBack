/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import * as TestComp from "../src/testwidgets/TestComp";
import * as RootComp from "../src/testwidgets/RootComp";
import { expect } from "chai";
import { mergeAll, getObjStreams } from "../src/testwidgets/Renderer";
import * as DomUtil from "./domutils";
import * as state from "../src/appstate";

describe("Streaming function Merger1", () => {
  it("should return hello world", () => {
    const state = TestComp.init(); // RootComp.init();
    const m = {}; // mergeAll(getObjStreams(state));
    state.add$(1);
    expect(state.sum$()).to.equal(1);
    state.add$(1);
    expect(state.sum$()).to.equal(2);
    state.add$(1);
    expect(state.sum$()).to.equal(3);
  });
});

/**describe("Initial App state is correct", () => {
  it("should load dataset", () => {
    const init_state = state.init();
    init_state.dataset.loadClickStream(1);
    chai.expect(init_state.dataset.contents().size).to.gt(1);
  });
});**/

