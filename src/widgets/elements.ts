import h from "snabbdom/h";
import * as R from "ramda";

export function textInput(targetStream: any, value?: string) {
    return h("input",
        {
            props: { type: "text", value: value || targetStream() },
            on: { change: (e: any) => targetStream(e.target.value) }
        });
}

export function numberInput(targetStream: any) {
    return h("input",
        {
            props: { type: "text", value: targetStream() },
            on: { change: (e: any) => targetStream(parseInt(e.target.value)) }
        });
}

export function singleSelect(options: any, targetStream: any, defaultVal?: any) {
    const makeOptions = function (opt: [any]) {
        return h("option", { props: { value: opt[1] } }, opt[0]);
    }
    console.log("Default" , defaultVal || options[0][1]);
    return h("select", {
        on: {
            change: (e: any) => targetStream(parseInt(e.target.value)),
            value: defaultVal || options[0][1]
        }
    }, R.map(makeOptions, options));

}