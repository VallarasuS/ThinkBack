const jsdom = require("jsdom")

declare var global: any;
// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body><div id="app"></div></div></body></html>')

// get the window object out of the document
const win = doc.defaultView

// set globals for mocha that make access to document and window feel 
// natural in the test environment
global.document = doc
global.window = win

// take all properties of the window object and also attach it to the 
// mocha global object
propagateToGlobal(win)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
export function propagateToGlobal (window:any) {
  for (const key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}