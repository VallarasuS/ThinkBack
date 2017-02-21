import h from "snabbdom/h"

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
