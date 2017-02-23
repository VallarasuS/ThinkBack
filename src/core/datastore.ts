import * as R from "ramda";
import * as I from "./instruments";
const taffy = require("taffydb").taffy;

export class DataStore {
    private _store: any;
    private static instance: DataStore = new DataStore();
    private constructor() {
        this._store = taffy();
    }

    public static getInstance = function (): DataStore {
        if (!this.instance) {
            console.log("Instantiating datastore");
            this.instance = new DataStore();
        }
        return this.instance;
    }

    public reset = function () {
        this._store = taffy();
    }

    public add = function (jsonStr: string): void {
        const parsed: [Instrument] = JSON.parse(jsonStr);
        this._store = taffy(parsed);
    }

    public size = function () {
        return this._store().count();
    }

    public byTradeDate = function (trade_date: number): [Instrument] {
        return DataStore.toInstruments(this.filterByTradeDate(trade_date))
    }

    public isEmptyOnDate = function (trade_date: number): boolean {
        return this.filterByTradeDate(trade_date).count() === 0;
    }

    public findExpiriesForDate = function (trade_date: number): [number] {
        return this.filterByTradeDate(trade_date).distinct("expiriy");
    }

    public optionsChain = function (trade_date: number, limit: number, expiry?: number): OptionsChain {
        const index: Instrument = this._store(Query.indexByTradeDate(trade_date)).first();
        const vix: Instrument = this._store(Query.vixByTradeDate(trade_date)).first();
        const expiries: [number] = this._store(Query.indexFutByTradeDate(trade_date)).order("expiry").select("expiry");
        const defaultExpiry = expiry || expiries[0];
        const opRange = I.optionsChainStrikeRange(index, limit);
        const options = this._store([{ trade_date: trade_date, type: [I.InstrumentType.CE, I.InstrumentType.PE] }])
            .filter({ strike: { "gte": opRange.lowerStrike } })
            .filter({ strike: { "lte": opRange.upperStrike } })
            .filter({ expiry: defaultExpiry })
            .order("strike");
        const opChain: OptionsChain = {
            index: index,
            expiries: expiries,
            bounds: opRange,
            items: I.toOptionsPair(DataStore.toInstruments(options)),
            selectedExpiry: defaultExpiry,
            vix: vix,
            trade_date: trade_date

        }
        // return DataStore.toInstruments(options);
        return opChain;
    }
    private static toInstruments = function (storeResults: any): [Instrument] {
        return storeResults.map((rec: Instrument, no: number) => rec);
    }

    private filterByTradeDate = function (trade_date: number) {
        return this._store({ trade_date: trade_date });
    }

}
class Query{
    public static byTradeDateAndType = function (trade_date: number, type: I.InstrumentType ): Object{
        return { trade_date: trade_date, type: type }
    }

    public static indexByTradeDate = function (trade_date: number): Object{
        return Query.byTradeDateAndType(trade_date, I.InstrumentType.Index);
    }

    public static vixByTradeDate = function (trade_date: number): Object{
        return Query.byTradeDateAndType(trade_date, I.InstrumentType.VIX);
    } 

    public static indexFutByTradeDate = function (trade_date: number): Object{
        return Query.byTradeDateAndType(trade_date, I.InstrumentType.IndexFuture);
    }
}
export const DataStoreInstance = DataStore.getInstance();