
interface State { }
interface DataSetState extends State {
    dataset: {
        startDate(val?: any): any
        contents(val?: any): any
        loadClickStream(val?: any): any
        loadActionStream(): any
        msgStream(): any
        endDate(): any
    }
}
interface OPChainState extends State {
    opChain: {
        loadClickStream(): any
        loadActionStream?(): any
        msgStream(): any
        endDate(): any
        loadSize(val?: any): any
        navBtnClick$(val?: any): any
    }
}

interface Chart {
    chart: {
        btnClick$(val?: any): any
    }
}

interface AppState
    extends DataSetState, OPChainState, Chart {
}

interface Instrument {
    open: number,
    expiry: number,
    trade_date: number,
    name: String,
    type: number,
    close: number,
    volume?: number,
    high: number,
    strike: number,
    underlying: String,
    low: number,
    oi?: number
}
interface Component{
    view(state: State): any;
    init(): State;
}
type OptionsPair = {
    ce: Instrument,
    pe: Instrument
}

type OptionsRange = {
    lowerStrike: number
    upperStrike: number
}

interface OptionsChain{
    index: Instrument,
    vix?: Instrument,
    opts?: any,
    items: [OptionsPair],
    bounds: OptionsRange,
    trade_date: number,
    expiries: [number],
    selectedExpiry: number
}