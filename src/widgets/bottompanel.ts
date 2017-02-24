import h from "snabbdom/h";
import * as R from "ramda";
import { DataStore } from "../core/datastore";
import * as datetime from "../core/datetime";
import * as elems from "./elements";

const flyd = require("flyd");

interface OptionsDetailsState extends State {
    
}
/**
 * 
 */
export class OptionsDetails implements Component {
    /**
     * Component state 
     */
    private state: OptionsDetailsState = {
        
    }
   
    /**
     * View builder. Called from appui. Changes to any attr in the state strem invokes
     * the view function automagically.
     */
    public view = function (state: OptionsDetailsState): any {
        return h("div" , "Options Greek go here !!!");
    }
    public init = function (): OptionsDetailsState {
        return this.state;
    }
}