import { Order } from '@gfxlabs/oku'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../../../vendor/charting_library/charting_library'
import { colors } from '../../../constants/colors'
import { useDataContext } from '../../../context/DataContext'
import { useI18nContext } from '../../../context/I18nContext'
import { useUserOrderContext } from '../../../context/UserOrderContext'
import { TradingViewDatafeed } from '../../../data/TradingViewDatafeed'
import useCreateOrderLine from '../../../hooks/useCreateTVOrderlines'
import { useChainLoader } from '../../../route/loaderData'
import { ChartEnums } from '../../../types/Enums'
import { useChartDataContext } from '../context/ChartDataContext'

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval']
  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  container: ChartingLibraryWidgetOptions['container']
}

export const TradingViewChart = () => {
  const chartContainerRef =
    useRef<IChartingLibraryWidget>() as React.MutableRefObject<IChartingLibraryWidget>
  const { allUserOrders } = useUserOrderContext()
  const i18n = useI18nContext()
  const { setChartType } = useChartDataContext()
  const { cushRpc } = useChainLoader()
  const { poolAddress, token, setToken } = useDataContext()
  const [activeTradeList, setActiveTradeList] = useState<Order[] | undefined>(
    []
  )
  const [isQuoteFlipped, setIsQuoteFlipped] = useState(false)
  const symbolName = () =>
    `${poolAddress}_${token.flipped ? '_flip' : '_noflip'}`

  const { deleteLines, drawLinesForLimitOrders } =
    useCreateOrderLine(chartContainerRef)
  const defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: symbolName(),
    interval: '1H' as ResolutionString,
    libraryPath: '/app/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'oku.trade',
    userId: 'user',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  }
  const [tvWidget, setTvWidget] = React.useState<
    IChartingLibraryWidget | undefined
  >(undefined)
  const [swapButton, setSwapButton] = React.useState<HTMLElement | undefined>(
    undefined
  )

  useEffect(() => {
    if (allUserOrders == undefined) return
    setActiveTradeList(
      allUserOrders.filter(
        (order) =>
          order.pool === poolAddress &&
          order.type === 'LIMIT' &&
          (order.status === 'OPEN' || order.status === 'FILLED')
      )
    )
    // drawLinesForLimitOrders(activePoolOrders)
  }, [poolAddress, allUserOrders, tvWidget])

  useEffect(() => {
    if (
      chartContainerRef.current == undefined ||
      activeTradeList == undefined ||
      activeTradeList.length === 0
    )
      return
    deleteLines()
    drawLinesForLimitOrders(activeTradeList, isQuoteFlipped)
  }, [activeTradeList, chartContainerRef.current])

  useEffect(() => {
    if (cushRpc == undefined) return
    const df = new TradingViewDatafeed(cushRpc)
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: symbolName(),
      datafeed: df,
      interval:
        defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      container: 'test',
      library_path: defaultProps.libraryPath as string,
      theme: 'dark',
      locale: i18n.locale as LanguageCode,
      disabled_features: [
        'header_saveload',
        'header_compare',
        'header_symbol_search',
        'symbol_search_hot_key',
        'header_chart_type',
        'popup_hints',
        'use_localstorage_for_settings',
        'adaptive_logo',
      ],
      enabled_features: [
        'study_templates',
        'volume_force_overlay',
        'create_volume_indicator_by_default',
        'pinch_scale',
        'show_zoom_and_move_buttons_on_touch',
        'horz_touch_drag_scroll',
        'vert_touch_drag_scroll',
      ],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      custom_css_url: '/app/css/tradingview.css',
      overrides: {
        'paneProperties.background': colors.gray[900],
        'paneProperties.backgroundType': 'solid',
      },
    }
    const Widget = widget

    const tv = new Widget(widgetOptions)
    tv.onChartReady(() => {
      tv.watermark().visibility().setValue(false, true)
      tv.headerReady().then(() => {
        {
          const button = tv.createButton({
            useTradingViewStyle: false,
            align: 'left',
          })
          setSwapButton(button)
          button.setAttribute('title', 'Flip Quote')
          button.classList.add('apply-common-tooltip')
          button.innerHTML = 'Flip Quote'
        }
        {
          const button = tv.createButton({
            useTradingViewStyle: false,
            align: 'right',
          })
          button.setAttribute('title', 'Open Depth Chart')
          button.classList.add('apply-common-tooltip')
          button.innerHTML = 'Depth Chart'
          button.onclick = () => setChartType(ChartEnums.DEPTH)
        }
        tv.setCSSCustomProperty(
          '--tv-color-toolbar-toggle-button-background-active',
          colors.gray[900]
        )
        tv.setCSSCustomProperty('--tv-color-pane-background', colors.gray[900])
        tv.setCSSCustomProperty(
          '--tv-color-platform-background',
          colors.gray[900]
        )
        setTvWidget(tv)
        chartContainerRef.current = tv
      })
    })
    return () => {
      tv.remove()
      df.cleanup()
    }
  }, [chartContainerRef, cushRpc])

  useEffect(() => {
    if (chartContainerRef.current !== null) {
      try {
        chartContainerRef.current.setSymbol(symbolName(), '1H' as any, () => {
          if (allUserOrders !== undefined) {
            deleteLines()
            const activePoolOrders = allUserOrders.filter(
              (order) =>
                order.pool === poolAddress &&
                order.type === 'LIMIT' &&
                (order.status === 'OPEN' || order.status === 'FILLED')
            )
            drawLinesForLimitOrders(activePoolOrders, isQuoteFlipped)
          }
          return
        })
      } catch (e) {}
    }
  }, [token, poolAddress, tvWidget, allUserOrders])

  useEffect(() => {
    if (chartContainerRef.current !== null) {
      try {
        if (allUserOrders !== undefined) {
          deleteLines()
          const activePoolOrders = allUserOrders.filter(
            (order) => order.pool === poolAddress && order.status === 'OPEN'
          )
          drawLinesForLimitOrders(activePoolOrders, isQuoteFlipped)
        }
        return
      } catch (e) {
        window.log.error(e)
      }
    }
  }, [allUserOrders])

  useEffect(() => {
    if (swapButton) {
      swapButton.onclick = () => {
        setToken(-1)
        setIsQuoteFlipped(!isQuoteFlipped)
      }
    }
  }, [swapButton, token])

  return (
    <div id="test" className={'TVChartContainer w-full h-full px-1 py-1'} />
  )
}
