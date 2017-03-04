import h from "snabbdom/h";
import * as R from "ramda";
import { DataStore } from "../core/datastore";
import * as datetime from "../core/datetime";
import * as I from "../core/instruments";
import * as elems from "./elements";

const flyd = require("flyd");
const bs = require("../thirdparty/blackscholes");

interface OptionsDetailsState extends State {
    currentOption$(val?: OptionsPair): OptionsPair
    tradeDate$(val?: number): number
    index$(val?: Instrument): Instrument
    vix$(val?: Instrument): Instrument
    expiryDate$(val?: number): number
}
/**
 * 
 */
export class OptionsDetails implements Component {
    /**
     * Component state 
     */
    private state: OptionsDetailsState;

    public constructor() {
        const currentOption$ = flyd.stream();
        const tradeDate$ = flyd.stream();
        const expiryDate$ = flyd.stream();
        const index$ = flyd.map(function (date: number) { return DataStore.getInstance().getIndexInstrument(date) }, tradeDate$);
        const vix$ = flyd.map(function (date: number) { return DataStore.getInstance().getVixInstrument(date) }, tradeDate$);
        this.state = { currentOption$, tradeDate$, index$, vix$, expiryDate$ };
    }
    private static greeksRow = function (greeks: OptionGreeks, prop: string, title: string) {
        return h("tr", [
            h("td", title),
            h("td", greeks.ce[prop].toString()),
            h("td", greeks.pe[prop].toString())
        ])
    }
    private static greeksTable = function (greeks: OptionGreeks) {
        return h("table", [
            h("thead", [
                h("tr", [h("td", ""), h("td", "Call"), h("td", "Put")])
            ]),
            h("tbody", [
                OptionsDetails.greeksRow(greeks, "price", "Price"),
                OptionsDetails.greeksRow(greeks, "delta", "Delta"),
                OptionsDetails.greeksRow(greeks, "gamma", "Gamma"),
                OptionsDetails.greeksRow(greeks, "theta", "Theta"),
                OptionsDetails.greeksRow(greeks, "vega", "Vega"),
                OptionsDetails.greeksRow(greeks, "rho", "Rho"),
                OptionsDetails.greeksRow(greeks, "omega", "Omega")
            ])
        ]);
    }
    /**
     * 
     */
    private static greeksView = function (state: OptionsDetailsState) {
        const selectedOptionPair: OptionsPair = state.currentOption$();
        if (!selectedOptionPair ||
            (!selectedOptionPair.ce && !selectedOptionPair.pe)) {
            return h("div", "Select an option to view its greeks");
        }
        const strike = selectedOptionPair.ce ? selectedOptionPair.ce.strike :
            selectedOptionPair.pe.strike;
        const tte = datetime.diff(state.expiryDate$() , state.tradeDate$());
        console.log("TTY ", tte);
        const greeks = I.greeks(state.index$().close, strike, 0.08, state.vix$().close, tte);

        return OptionsDetails.greeksTable(greeks);
    }
    /**
     * View builder. Called from appui. Changes to any attr in the state strem invokes
     * the view function automagically.
     */
    public view = function (state: OptionsDetailsState): any {
        return h("div#bottompanel-content.scrollpane",
            OptionsDetails.greeksView(state));
    }
    /**
     * 
     */
    public init = function (): OptionsDetailsState {
        return this.state;
    }
}