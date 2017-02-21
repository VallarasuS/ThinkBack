import h from "snabbdom/h"
import * as R from "ramda"
const flyd = require("flyd")
import * as  snabbdom from "snabbdom";
import * as sbModClass from "snabbdom/modules/class";
import * as sbModProps from "snabbdom/modules/props";
import * as sbModStyle from "snabbdom/modules/style";
import * as sbModEvtLs from "snabbdom/modules/eventlisteners";
import * as sbModAttrs from "snabbdom/modules/attributes";

const patch = snabbdom.init([sbModClass.default, 
                             sbModProps.default, sbModStyle.default,
                             sbModEvtLs.default, sbModAttrs.default])
flyd.mergeAll = require("flyd/module/mergeall");

// flyd.mergeAll = fmMergeAll; 
// A component has a:
//   state: object of static data and flyd streams
//   view: snabbdom view function
//   container: the DOM element we want to replace with our rendered snabbdom tree
export function render(view: any, state: any, container: any) {
  console.log("rendering ..", mergeAll);
  const state$ = flyd.mergeAll(getObjStreams(state))
  const viewState = function (c: any) { console.log(c); return view(state) }
  const view$ = flyd.map(viewState, state$)
  const vtree$ = flyd.scan(patch, container, view$)
  state$([]) // trigger an initial patch
  const dom$ = flyd.map(function (vnode: any) { return vnode.elm }, vtree$)
  return { state$: state$, vtree$: vtree$, dom$: dom$ }
}

// Return all the streams within an object, including those nested further down
export function getObjStreams(obj: any) {
  let stack = [obj]
  let streams: any[] = []
  while (stack.length) {
    const vals = R.values(stack.pop())
    streams = R.concat(streams, R.filter(flyd.isStream, vals))
    stack = R.concat(stack, R.filter(isPlainObj, vals))
  }
  return streams
}

// Utils

function isPlainObj(obj: any) {
  // tslint:disable-next-line:no-null-keyword
  if (typeof obj === "object" && obj !== null) {
    if (typeof Object.getPrototypeOf === "function") {
      const proto = Object.getPrototypeOf(obj)
      // tslint:disable-next-line:no-null-keyword
      return proto === Object.prototype || proto === null
    }
    return Object.prototype.toString.call(obj) == "[object Object]"
  }
  return false
}



export function mergeAll(streams: any[]) {
  const s = flyd.immediate(flyd.combine(function () {
    const self = arguments[arguments.length - 2];
    if (arguments[arguments.length - 1][0]) {
      self(arguments[arguments.length - 1][0]());
      return;
    }
    [].slice.call(arguments, 0, arguments.length - 2)
      .some(function (s1: any) {
        if (s1.hasVal) {
          self(s1.val);
          return true;
        }
      });
  }, streams));
  flyd.endsOn(flyd.combine(function () {
    return true;
  }, streams.map(function (sm) { return sm.end; })), s);
  return s;
};
