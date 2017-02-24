import h from "snabbdom/h";
import * as R from "ramda"
import * as  snabbdom from "snabbdom";
import * as sbModClass from "snabbdom/modules/class";
import * as sbModProps from "snabbdom/modules/props";
import * as sbModStyle from "snabbdom/modules/style";
import * as sbModEvtLs from "snabbdom/modules/eventlisteners";
import * as sbModAttrs from "snabbdom/modules/attributes";
const flyd = require("flyd")
flyd.mergeAll = require("flyd/module/mergeall");

export const patch = snabbdom.init([sbModClass.default,
                             sbModProps.default, sbModStyle.default,
                             sbModEvtLs.default, sbModAttrs.default])

export function mountComponent(container: any, widget: Component) {
  render(widget.view, widget.init(), container);
}

export function render(view: any, state: any, container: any) {
  console.log("Initial Render begins ..");
  const state$ = flyd.mergeAll(getObjStreams(state))
  const viewState = function (c: any) { return view(state) }
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
