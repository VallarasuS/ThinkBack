import { h } from "snabbdom/h";
import * as R from "ramda";
import { DataStore } from "../core/datastore";
import * as datetime from "../core/datetime";
import * as elems from "./elements";

const flyd = require("flyd");

interface OptionsBrowserState extends State {
    tradeDate$(val?: any): any
    contentsLoaded$(val?: any): any
    selectedExpiry$(val?: any): any
    selectedDepth$(val?: any): any
    selectedRow$(val?: any): any
}
/**
 * 
 */
export class OptionsBrowser implements Component {
    /**
     * Component state 
     */
    private state: OptionsBrowserState = {
        tradeDate$: flyd.stream(),
        contentsLoaded$: flyd.stream(false),
        selectedExpiry$: flyd.stream(),
        selectedDepth$: flyd.stream(400),
        selectedRow$: flyd.stream()
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
    private static rowIdentifier = function (option: Instrument) {
        return option;
    }
    //
    private static makeRow = function (state: OptionsBrowserState, pair: OptionsPair) {
        const rowData: any = R.flatten([
            OptionsBrowser.makeOptionColumns(pair.ce),
            OptionsBrowser.makeStrikeCol(pair),
            OptionsBrowser.makeOptionColumns(pair.pe)]);
        return h("tr", rowData);
    }
    //
    private static makeHeader = function (): any {
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
    private static makeOptionsChain = function (state: OptionsBrowserState): any {
        if (!state.tradeDate$()) {
            return h("div", "No data to show");
        }
        const rowBuilderFn = function(item: OptionsPair){
            return OptionsBrowser.makeRow(state, item);
        }
        const chain: OptionsChain = DataStore.getInstance()
                                    .optionsChain(state.tradeDate$(), state.selectedDepth$(), 
                                    state.selectedExpiry$());
        return h("div", [
            OptionsBrowser.makeOptionsChainHeader(chain, state),
            h("table", [
                OptionsBrowser.makeHeader(),
                h("tbody", R.map(rowBuilderFn, chain.items))
            ])]);
    }
    /**
     * 
     */
    private static makeOptionsChainHeader = function (chain: OptionsChain, state: OptionsBrowserState): any {
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
     * View builder. Called from appui. Changes to any attr in the state strem invokes
     * the view function automagically.
     */
    public view = function (state: OptionsBrowserState): any {
        // TODO: build op chain only when trade date is selected
        return h("div#optionschain.optionschain", [
            OptionsBrowser.makeOptionsChain(state)]);
    }
    public init = function (): OptionsBrowserState {
        return this.state;
    }
}