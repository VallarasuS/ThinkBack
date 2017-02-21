import h from "snabbdom/h"
import * as R from "ramda"

const flyd = require("flyd")

export function view(state: any): any {
  return layout(state);
}

export function layout(state: any): any {
  return h("div.app", [
    h("div.row", [
      wsView(state),
      rightPanel(state)
    ])
  ]);
}

export function rightPanel(state: any): any {
  return h("div.col", [
    h("div.panel.twothird", optionsExplorerPanel(state)),
    h("div.panel.onethird", bottomPanel(state))
  ]);
}

export function wsView(state: any): any {
  return h("div.panel.workspace", [
    h("div.ws-item", [h("a", { href: "" }, "Link1")]),
    h("div.ws-item", [h("a", { href: "" }, "Link1")])
  ]);
}

export function bottomPanel(state: any): any {
  return h("div.bottompanel", [
    // Tab Header
    h("div.tabs", [
      h("div.tabitem.selected-tab", "Tab One"),
      h("div.tabitem", "Tab Two"),
    ]),
    // Tab content in a scoller view
    h("div.tab-content.vscroll", [
      h("div.scrollpane", [
        h("div", "asdfasd content here a asdf"),
        h("div", "asdfasd content here a asdf"),
        h("div", "asdfasd content here a asdf"),
        h("div", "asdfasd content here a asdf")
      ])
    ])
  ]);
}

export function optionsExplorerPanel(state: any): any {
  return h("div.mainpanel", [
    h("div.panel1.twothird.mainpanel-left", [optionsContextView(state)]),
    h("div.panel1.onethird.mainpanel-right", [optionsBrowserView(state)])
  ]);
}

export function optionsContextView(state: any): any {
  return h("div.browserview", "Main content 1.1");
}

export function optionsBrowserView(state: any): any {
  return h("div.mainpanel-content", "Main content 1.0");
}