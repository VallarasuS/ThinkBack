import h from "snabbdom/h";
import * as R from "ramda";
import { DataStore } from "../core/datastore";
import * as datetime from "../core/datetime";

const flyd = require("flyd");

interface OptionsBrowserState extends State {
    tradeDate$(val?: any): any
    contentsLoaded$(val?: any): any
}
export class OptionsBrowser implements Component {
    /**
     * Component state 
     */
    private state: OptionsBrowserState = {
        tradeDate$: flyd.stream(),
        contentsLoaded$: flyd.stream(false)
    }
    private static makeStrikeCol = function (pair: OptionsPair) {
        const strike = pair.ce ? pair.ce.strike : pair.pe.strike;
        return h("td", strike.toString());
    }
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

    public static makeRow = function (pair: OptionsPair) {
        return h("tr", R.flatten([
            OptionsBrowser.makeOptionColumns(pair.ce),
            OptionsBrowser.makeStrikeCol(pair),
            OptionsBrowser.makeOptionColumns(pair.pe)]));
    }
    public static makeHeader = function (): any {
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
    private static makeOptionsChain = function (state: OptionsBrowserState): any {
        if (!state.tradeDate$()) {
            return h("div", "No data to show");
        }
        const chain: OptionsChain = DataStore.getInstance().optionsChain(state.tradeDate$());
        return h("div", [
            OptionsBrowser.makeOptionsChainHeader(chain),
            h("table", [
                OptionsBrowser.makeHeader(),
                h("tbody", R.map(OptionsBrowser.makeRow, chain.items))
            ])]);
    }
    private static makeOptionsChainHeader = function (chain: OptionsChain): any {
        if (!chain) {
            return h("div", "Select a date ...");
        }
        return h("div.optionschain-header", [
            h("div", "Expiry : "),
            h("div", datetime.tsToDateStr(chain.selectedExpiry)),
            h("div", "Depth : "),
            h("div", chain.items.length.toString())
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