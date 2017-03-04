import { h } from "snabbdom/h";
import * as R from "ramda";
import { DataStore } from "../core/datastore";
import * as datetime from "../core/datetime";
import * as elems from "./elements";

const flyd = require("flyd");
interface TradeDateWidgetState extends State {
    selectedDate$(val?: string): string
}
interface OptionsBrowserState extends State {
    tradeDate$(val?: any): any
    selectedExpiry$(val?: any): any
    selectedDepth$(val?: any): any
    selectedRow$(val?: any): any
    selectedDate$(val?: any): any
}
/**
 * 
 */
export class OptionsBrowser implements Component {
    /**
     * Component state 
     */
    private state: OptionsBrowserState;

    public constructor() {
        const selectedExpiry$ = flyd.stream();
        const selectedDepth$ = flyd.stream(400);
        const selectedRow$ = flyd.stream();
        const selectedDate$ = flyd.stream();
        const tradeDate$ = flyd.map(datetime.dateStrToTs, selectedDate$);
        this.state = { selectedDepth$, selectedExpiry$, selectedRow$, tradeDate$, selectedDate$ };
    }
    //
    private static makeStrikeCol = function (pair: OptionsPair) {
        const strike = pair.ce ? pair.ce.strike : pair.pe.strike;
        return h("td", strike.toString());
    }
    //
    private static makeOptionColumns = function (options: Instrument) {
        if (options) {
            return [h("td", options.open.toString()),
            h("td", options.high.toString()),
            h("td", options.low.toString()),
            h("td", options.close.toString())];
        }
        else {
            return [h("td", ""), h("td", ""), h("td", ""), h("td", "")];
        }
    }
    private static opcRowID = function (option: Instrument) {
        return option;
    }
    //
    private static opcRow = function (state: OptionsBrowserState, pair: OptionsPair) {
        const rowData: any = R.flatten([
            OptionsBrowser.makeOptionColumns(pair.ce),
            OptionsBrowser.makeStrikeCol(pair),
            OptionsBrowser.makeOptionColumns(pair.pe)]);
        return h("tr", { on: { click: function () { state.selectedRow$(pair) } } }, rowData);
    }
    //
    private static opcTableHeader = function (): any {
        return h("thead", [
            h("th", "Open"),
            h("th", "High"),
            h("th", "Low"),
            h("th", "Close"),
            h("th", "Strike"),
            h("th", "Open"),
            h("th", "High"),
            h("th", "Low"),
            h("th", "Close")
        ]);
    }
    /**
     * 
     */
    private static optionsChainHeader = function (chain: OptionsChain, state: OptionsBrowserState): any {
        if (!chain) {
            return h("div", "Select a date ...");
        }
        const t = function (ts: number) {
            return [datetime.tsToDateStr(ts), ts];
        }
        const expiryDateOpts = R.map(t, chain.expiries);
        return h("div.optionschain-header", [
            h("div", "Expiry : "),
            elems.singleSelect(expiryDateOpts, state.selectedExpiry$),
            h("div", "Depth : "),
            elems.numberInput(state.selectedDepth$)
        ]);
    }
    /**
     * 
     */
    private static optionsChain = function (state: OptionsBrowserState): any {
        if (!state.tradeDate$()) {
            return h("div", "No data to show");
        }
        const rowBuilderFn = function (item: OptionsPair) {
            return OptionsBrowser.opcRow(state, item);
        }
        const chain: OptionsChain = DataStore.getInstance()
            .optionsChain(state.tradeDate$(), state.selectedDepth$(),
            state.selectedExpiry$());
        return h("div", [
            OptionsBrowser.optionsChainHeader(chain, state),
            h("table", [
                OptionsBrowser.opcTableHeader(),
                h("tbody", R.map(rowBuilderFn, chain.items))
            ])
        ]);
    }
    /**
     * View builder. Called from appui. Changes to any attr in the state strem invokes
     * the view function automagically.
     */
    public view = function (state: OptionsBrowserState): any {
        return h("div#optionschain.optionschain", [OptionsBrowser.optionsChain(state)]);
    }
    public init = function (): OptionsBrowserState {
        return this.state;
    }
}

export class TradeDateWidget implements Component {

    private state = {
        selectedDate$: flyd.stream()
    }

    public view = function (state: TradeDateWidgetState): any {
        return h("div", [
            h("label", "Trade Date : "),
            elems.textInput(state.selectedDate$)
        ]);
    }

    public init = function (): TradeDateWidgetState {
        return this.state;
    }
}