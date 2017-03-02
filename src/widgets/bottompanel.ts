import h from "snabbdom/h";
import * as R from "ramda";
import { DataStore } from "../core/datastore";
import * as datetime from "../core/datetime";
import * as I from "../core/instruments";
import * as elems from "./elements";
// import {BS, BSHolder} from "../thirdparty/blackscholes";

const flyd = require("flyd");
const bs = require("../thirdparty/blackscholes");
interface OptionsDetailsState extends State {
    currentOption$(val?: OptionsPair): OptionsPair
}
/**
 * 
 */
export class OptionsDetails implements Component {
    /**
     * Component state 
     */
    private state: OptionsDetailsState = {
        currentOption$: flyd.stream()
    }
    private static greeksView = function (state: OptionsDetailsState) {
        const selectedOptionPair: OptionsPair = state.currentOption$();
        if (!selectedOptionPair ||
            (!selectedOptionPair.ce && !selectedOptionPair.pe)) {
            return h("div", "Select an option to view its greeks");
        }
        const strike = selectedOptionPair.ce ? selectedOptionPair.ce.strike :
            selectedOptionPair.pe.strike;
        const greeks = I.greeks(8907, strike, 0.07, 0.12, 2);
        console.log(JSON.stringify(greeks));
        return h("div", " Greeks for " + JSON.stringify(greeks));
    }
    /**
     * View builder. Called from appui. Changes to any attr in the state strem invokes
     * the view function automagically.
     */
    public view = function (state: OptionsDetailsState): any {
        return h("div#bottompanel-content.scrollpane",
            OptionsDetails.greeksView(state));
    }
    public init = function (): OptionsDetailsState {
        return this.state;
    }
}