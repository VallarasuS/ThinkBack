import h from "snabbdom/h";
import * as R from "ramda";
import { mountComponent } from "./renderer";
import { OptionsBrowser, TradeDateWidget } from "./opBrowser";
import { OptionsDetails } from "./opContext";
import { DataStore } from "../core/datastore";
const flyd = require("flyd");

export function configure() {
    const op_browser = new OptionsBrowser();
    const op_details = new OptionsDetails();
    const tradeDateWidget = new TradeDateWidget();
    mountComponent(document.querySelector("#TradeDateWidget"), tradeDateWidget);
    mountComponent(document.querySelector("#optionschain"), op_browser);
    mountComponent(document.querySelector("#bottompanel-content"), op_details);
    setupMock(op_browser, tradeDateWidget);
    // flyd.map(function(i: any){console.log(i);}, op_details.init().currentOption$);
    connect(tradeDateWidget.init().selectedDate$, op_browser.init().selectedDate$);
    connect(op_browser.init().selectedRow$, op_details.init().currentOption$);
    connect(op_browser.init().tradeDate$, op_details.init().tradeDate$);
    connect(op_browser.init().selectedExpiry$, op_details.init().expiryDate$);
}

const connect = function (source$: any, tgt$: any) {
    flyd.map(function (val: any) {
        tgt$(val);
    }, source$);
    tgt$(source$());
}

const setupMock = function (opb: OptionsBrowser, td: TradeDateWidget) {
    const request = new XMLHttpRequest();
    const ds = DataStore.getInstance();
    console.log("Datastore setup begins !!");
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const response = JSON.stringify(request.responseText);
                ds.add(JSON.parse(response));
                console.log("Datastore seeded !!");
                // opb.init().tradeDate$(1475452800000);
                // opb.init().selectedDate$("20161003");
                td.init().selectedDate$("20161003");
            } else {
                console.log("Error setting up datastore");
            }
        }
    }
    request.open("GET", "data/20161031.json");
    request.send();
}