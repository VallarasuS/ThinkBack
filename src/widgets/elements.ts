import h from "snabbdom/h";
import * as R from "ramda";

export function textInput(targetStream: any) {
    return h("input",
                    { props: { type: "text" },
                    on: { change: (e: any) => targetStream(e.target.value) } });
}

export function numberInput(targetStream: any) {
    return h("input",
                    { props: { type: "text" },
                    on: { change: (e: any) => targetStream(parseInt(e.target.value)) } });
}

export function singleSelect(options: [any] , targetStream: any) {
    const makeOptions = function(opt){
		return h("option" , {props:{value: opt[1]}}, opt[0]);
	}
	return h("select" , {on: { change: (e: any) => targetStream(e.target.value) }}, R.map(makeOptions, options));
	
}