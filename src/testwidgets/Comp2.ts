import h from "snabbdom/h"
import * as R from "ramda"
const flyd = require("flyd")

function loadDataset(date: any){
  console.log("Loading dataset", date.target.value);
}
// The add$ stream constitutes the button clicks that increment
// The sum$ steam constitutes the running sum, starting with 0, incremented by add$
export function init() {
  const dateInput$ = flyd.stream()
  const date$ = flyd.map(loadDataset, dateInput$)
  return {dateInput$}
}

export function view(state: any) {
  return h("div", [
    h("h1", "Test Component #2"),
    h("input", {props: {type: "text"}, on : {change: state.dateInput$}}),
    h("button", {}, "Load !!"),

  ])
}
