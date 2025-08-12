import {
  Bar,
  ErrorCallback,
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  ServerTimeCallback,
  SubscribeBarsCallback,
} from '../../../vendor/charting_library/charting_library'
import { Candle, CushApi, PoolSummary, SearchFilterOpts } from '@gfxlabs/oku'
import { RpcClient } from '@gfxlabs/jsrpc'

export class TradingViewDatafeed implements IDatafeedChartApi {
  cush: RpcClient<CushApi>
  supportedResolutions: ResolutionString[] = [
    '1',
    '5',
    '15',
    '1H',
    '1D',
    '7D',
    '30D',
  ] as any

  constructor(cush: RpcClient<CushApi>) {
    this.subscriptions = new Map()
    this.cush = cush
  }

  onReady(callback: OnReadyCallback) {
    setTimeout(() =>
      callback({
        supports_marks: false,
        supported_resolutions: this.supportedResolutions,
      })
    )
  }

  /**
   * This function is called if configuration flag supports_time is set to true when chart needs to know the server time.
   * The library expects callback to be called once.
   * The time is provided without milliseconds. Example: `1445324591`. It is used to display Countdown on the price scale.
   */
  getServerTime?(callback: ServerTimeCallback): void

  /**
   * Provides a list of symbols that match the user's search query.
   *
   * @param userInput Text entered by user in the symbol search field
   * @param exchange The requested exchange. Empty value means no filter was specified
   * @param symbolType Type of symbol. Empty value means no filter was specified
   * @param onResult Callback function that returns an array of results ({@link SearchSymbolResultItem}) or empty array if no symbols found
   */
  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ): void {
    const opts: SearchFilterOpts = {
      fee_tiers: [],
      result_offset: 0,
      sort_by: 'tvl_usd',
      result_size: 20,
      sort_order: false,
    }
    this.cush.call('cush_search', [userInput, opts]).then((resp) => {
      const ans = resp.pools.map((x) => {
        const symbol = `v3_${x.t0_symbol}_${x.t1_symbol}_${x.fee}`
        const item: SearchSymbolResultItem = {
          type: 'stock',
          symbol,
          ticker: symbol,
          full_name: x.address,
          exchange: exchange,
          description: `Uniswap V3 ${x.t0_name}/${x.t1_name} ${x.fee}bp Pool`,
        }
        return item
      })
      onResult(ans)
    })
  }

  /**
   * The library will call this function when it needs to get SymbolInfo by symbol name.
   *
   * @param symbolName Symbol name or `ticker`
   * @param onResolve Callback function returning a SymbolInfo ({@link LibrarySymbolInfo})
   * @param onError Callback function whose only argument is a text error message
   * @param extension An optional object with additional parameters
   */
  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback
  ): void {
    const args = symbolName.split('_')

    let flip = symbolName.endsWith('_flip')
    let match = false
    let promise: Promise<PoolSummary | undefined> | undefined = undefined
    const exchange = 'UniV3'
    if (args[0].startsWith('0x')) {
      match = true
      promise = this.cush.call('cush_search', [args[0]]).then((resps) => {
        if (resps.pools.length < 1) {
          onError('No Pool Found')
          return
        }
        return resps.pools[0]
      })
      if (args.length > 1) {
        if (args[1] === 'flip') {
          flip = true
        }
      }
    }
    if (args[0] === 'v3') {
      match = true
      if (args.length <= 4) {
        onError('malformatted v3 symbol')
        return
      }
      promise = this.cush
        .call('cush_search', [
          [args[1], args[2]].join('/'),
          {
            fee_tiers: [Number(args[3])],
            sort_by: 'TvlUsd',
            sort_order: false,
            result_size: 1,
            result_offset: 0,
          },
        ])
        .then((resps) => {
          if (resps.pools.length < 1) {
            onError('No Pool Found')
            return
          }
          return resps.pools[0]
        })
    }
    if (promise) {
      promise.then((resp: PoolSummary | undefined) => {
        if (!resp) {
          onError('No Pool Found')
          return
        }
        let priceScale = 10 ** 2
        const minmov = 1
        const granularities = !flip
          ? resp.default_granularities
          : resp.default_flipped_granularities
        if (granularities[1] < 0) {
          priceScale = Math.pow(10, Math.abs(granularities[1]))
        } else if (granularities[1] > 6) {
          priceScale = 1
        }
        const x: LibrarySymbolInfo = {
          name: symbolName,
          description: `${exchange} ${flip ? resp.t1_symbol : resp.t0_symbol}/${
            flip ? resp.t0_symbol : resp.t1_symbol
          } ${resp.fee / 100}bp Pool`,
          pricescale: priceScale,
          listed_exchange: exchange.toLowerCase(),
          supported_resolutions: this.supportedResolutions,
          has_intraday: true,
          has_daily: true,
          has_weekly_and_monthly: true,
          type: 'crypto',
          format: 'price',
          minmov: minmov,
          sector: resp.address,
          delay: 0,
          exchange: 'Oku.Trade',
          session: '24x7',
          visible_plots_set: 'ohlcv',
          timezone: 'Etc/UTC',
          full_name: resp.address,
        }
        onResolve(x)
      })
    }
    if (!match) {
      onError(`unknown exchange: ${args[0]}`)
    }
  }

  parseResolution(resolution: ResolutionString): number {
    const ifWithMultiply = (x: string, suff: string, num: number) => {
      if (x.endsWith(suff)) {
        return Number(x.replace(suff, '')) * num
      }
      return -1
    }
    let x = ifWithMultiply(resolution, 'T', 1000)
    if (x > 0) return x
    x = ifWithMultiply(resolution, 'S', 1000)
    if (x > 0) return x
    x = ifWithMultiply(resolution, 'H', 60 * 60 * 1000)
    if (x > 0) return x
    x = ifWithMultiply(resolution, 'D', 24 * 60 * 60 * 1000)
    if (x > 0) return x
    x = ifWithMultiply(resolution, 'W', 7 * 24 * 60 * 60 * 1000)
    if (x > 0) return x
    x = ifWithMultiply(resolution, 'M', 30 * 24 * 60 * 60 * 1000)
    if (x > 0) return x

    const n = Number(resolution)
    if (!isNaN(n)) {
      return n * 1000 * 60
    }
    return 60 * 60 * 1000
  }

  transformBar(x: Candle, flip: boolean): Bar {
    return {
      time: x.time,
      low: x.low === 0 ? 0 : flip ? 1 / x.low : x.low,
      high: x.high === 0 ? 0 : flip ? 1 / x.high : x.high,
      open: x.open === 0 ? 0 : flip ? 1 / x.open : x.open,
      close: x.close === 0 ? 0 : flip ? 1 / x.close : x.close,
      volume: flip ? x.volume_quote : x.volume_base,
    }
  }

  /**
   * This function is called when the chart needs a history fragment defined by dates range.
   *
   * @param symbolInfo A SymbolInfo object
   * @param resolution Resolution of the symbol
   * @param periodParams An object used to pass specific requirements for getting bars
   * @param onResult Callback function for historical data
   * @param onError Callback function whose only argument is a text error message
   */
  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ): void {
    const res = this.parseResolution(resolution)
    if (!symbolInfo.ticker) {
      onError('no ticker')
      return
    }
    this.cush
      .call('cush_ohlcv', [
        symbolInfo.full_name,
        res,
        Math.floor(periodParams.from) * 1000,
        Math.ceil(periodParams.to) * 1000,
      ])
      .then((data) => {
        const flip = symbolInfo.name.endsWith('_flip')
        const res = data.candles.map((x) => {
          return this.transformBar(x, flip)
        })
        onResult(res)
      })
  }

  subscriptions: Map<string, NodeJS.Timeout>

  /**
   * The library calls this function when it wants to receive real-time updates for a symbol.
   * The library assumes that you will call the callback provided by the `onTick` parameter every time you want to update the most recent bar or to add a new one.
   *
   * @param symbolInfo A SymbolInfo object
   * @param resolution Resolution of the symbol
   * @param onTick Callback function returning a Bar object
   * @param listenerGuid
   * @param onResetCacheNeededCallback Function to be executed when bar data has changed
   */
  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string
  ): void {
    const lookback = this.parseResolution(resolution)
    const id = setInterval(() => {
      const stop = Math.ceil(new Date().valueOf())
      const start = stop - lookback
      this.cush
        .call('cush_ohlcv', [symbolInfo.full_name, lookback, start, stop])
        .then((data) => {
          const flip = symbolInfo.name.endsWith('_flip')
          const resp = data.candles.map((x) => {
            return this.transformBar(x, flip)
          })
          resp.forEach((x) => {
            onTick(x)
          })
        })
    }, lookback / 4)

    this.subscriptions.set(listenerGuid, id)
  }

  /**
   * The library calls this function when it doesn't want to receive updates anymore.
   *
   * @param listenerGuid id to unsubscribe from
   */
  unsubscribeBars(listenerGuid: string): void {
    const v = this.subscriptions.get(listenerGuid)
    if (v) {
      clearInterval(v)
    }
  }
  cleanup() {
    this.subscriptions.forEach((v) => {
      clearInterval(v)
    })
  }

  ///**
  // * Trading Terminal calls this function when it wants to receive real-time level 2 (DOM) for a symbol.
  // *
  // * @param symbol A SymbolInfo object
  // * @param callback Function returning an object to update Depth Of Market (DOM) data
  // * @returns A unique identifier that will be used to unsubscribe from the data
  // */
  //subscribeDepth?(symbol: string, callback: DOMCallback): string {
  //  return ''
  //}

  ///**
  // * Trading Terminal calls this function when it doesn't want to receive updates for this listener anymore.
  // *
  // * @param subscriberUID A string returned by `subscribeDepth`
  // */
  //unsubscribeDepth?(subscriberUID: string): void {}
  ///**
  // * The library calls this function to get the resolution that will be used to calculate the Volume Profile Visible Range indicator.
  // *
  // * Usually you might want to implement this method to calculate the indicator more accurately.
  // * The implementation really depends on how much data you can transfer to the library and the depth of data in your data feed.
  // * **Remark:** If this function is not provided the library uses currentResolution.
  // *
  // * @param currentResolution Resolution of the symbol
  // * @param from Unix timestamp (leftmost visible bar)
  // * @param to Unix timestamp (rightmost visible bar)
  // * @param symbolInfo A Symbol object
  // * @returns A resolution
  // */
  //getVolumeProfileResolutionForPeriod?(
  //  currentResolution: ResolutionString,
  //  from: number,
  //  to: number,
  //  symbolInfo: LibrarySymbolInfo
  //): ResolutionString {
  //  return '' as ResolutionString
  //}
}
