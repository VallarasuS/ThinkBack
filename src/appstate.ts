import * as R from "ramda"

const flyd = require("flyd")

function readTextFile(file: string, response$: any) {
    const rawFile: XMLHttpRequest = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            response$(rawFile.responseText);
        }
    }
    rawFile.send();
}
function loadDataSet(startDate: any, endDate: any, response$: any) {
    console.log("Loading data for ..", startDate, endDate);
    readTextFile("data/20161231.json", response$);
}

function mapResponse(response$: any) {
    const contents = JSON.parse(response$);
    console.log("response received. ", contents.length);
    return contents;
}

export function init(): AppState {
    /**const dsState = dataset.state();
    return R.mergeAll([dsState, opChain.state()]); **/

    const loadClickStream = flyd.stream();
    const startDate = flyd.stream("20160101");
    const endDate = flyd.stream("20161031");
    const response$ = flyd.stream();
    const loadActionStream = flyd.map(() => loadDataSet(startDate(), endDate(), response$), loadClickStream);
    const contents = flyd.map(mapResponse, response$);
    const loadSize = flyd.stream(10);
    const navBtnClick$ = flyd.stream();
    return {
        dataset: {
            startDate,
            endDate,
            contents,
            loadClickStream,
            loadActionStream,
            msgStream: flyd.map(() => "Loading ..", loadClickStream)
        },
         opChain: {
            endDate,
            loadClickStream,
            loadSize,
            navBtnClick$,
            msgStream: flyd.map(() => "Loading Op Chain..", loadClickStream)
        },
        chart: {
            btnClick$: flyd.stream()
        }
    }
}