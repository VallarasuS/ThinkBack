import h from "snabbdom/h"
import * as R from "ramda"
const flyd = require("flyd")
import * as MyComponent from "./TestComp"
import * as Comp2 from "./Comp2"

export function init() {
  const comp1State = MyComponent.init()
  const comp2State = Comp2.init()
  const counter$ = flyd.map(function(v: any){return "Comp 1 state is : "+v},comp1State.sum$)
  // flyd.scan(R.inc, 0, comp1State.sum$)//flyd.map(function(v){"Comp 1 state is : "+v},comp1State.sum$);
  return { comp1: comp1State, comp2: comp2State, counter$: counter$ }
}

export function view(state: any) {
  return h("div", [h("h1", "Root component ..."),
                  MyComponent.view(state.comp1),
                  Comp2.view(state.comp2),
                  h("h5", {}, String(state.counter$()))])
}