import { colors } from '../../../constants/colors'
import { useThemeContext } from '../../../context/ThemeContext'
import { useDataContext } from '../../../context/DataContext'
import { memo, useEffect, useState } from 'react'
import { Swap } from '@gfxlabs/oku'
import { Row } from '@tanstack/react-table'
import TradeHistoryCell from './TradeHistoryCell'
import {
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
  FloatingPortal,
  offset,
  shift,
} from '@floating-ui/react'
import { T3 } from '../../typography/Typography'
import { FormattedNumber } from '../../numbers/FormatNumber'
import { useWindowSize } from 'usehooks-ts'
import { useConfigContext } from '../../../context/ConfigContext'

interface ITradeHistoryRow {
  row: Row<Swap>
  isNew: boolean
  currentChainInfo: string
}

const TradeHistoryRow = memo(({ row, isNew, currentChainInfo }: ITradeHistoryRow) => {
  const { colors: themeColors } = useThemeContext()
  const { token } = useDataContext()
  const [isBlinking, setIsBlinking] = useState(isNew)
  const { width } = useWindowSize()
  const { features } = useConfigContext()

  useEffect(() => setIsBlinking(isNew), [isNew])
  useEffect(() => {
    if (isBlinking) setTimeout(() => setIsBlinking(false), 2000)
  }, [isBlinking])

  const isPos =
    (row.original.side === 'buy' && token.selected === 0) || (row.original.side === 'sell' && token.selected === 1)
  const firstRowFont = isBlinking
    ? isPos
      ? themeColors.pos_color
      : themeColors.neg_color
    : row.original.usd_value >= 1000
      ? colors.white
      : colors.gray[400]
  const [hover, setHover] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: hover,
    onOpenChange: setHover,
    placement: width < 1400 ? 'bottom' : 'left',
    middleware: [shift(), offset(10)],
  })
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0.5,0)' },
    common: { transformOrigin: 'top right' },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  const url = `${features.Analytics.url}/${currentChainInfo}/user/${row.original.event.sender}`
  return (
    <div>
      <a href={url} target="_blank" rel="noreferrer" ref={refs.setReference} {...getReferenceProps()}>
        <tr
          key={row.id}
          style={{
            backgroundColor: isBlinking
              ? (isPos ? themeColors.pos_color : themeColors.neg_color).concat(hover ? '24' : '14')
              : hover
                ? colors.gray[800]
                : undefined,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex relative w-full top-1 left-0 hover:bg-gray-800 h-[18px] px-2 justify-between"
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              <TradeHistoryCell row={row} type={cell.column.id} isPos={isPos} firstRowFont={firstRowFont} />
            </td>
          ))}
        </tr>
      </a>
      {hover && isMounted && (
        <FloatingPortal>
          <div className="z-50" ref={refs.setFloating} style={{ ...floatingStyles }} {...getFloatingProps()}>
            <div className="z-50 mt-1 bg-gray-750 border border-gray-700 rounded-lg" style={{ ...styles }}>
              <div className="p-2 flex flex-col gap-y-2 text-gray-50">
                <T3 color={colors.gray[300]}>
                  {new Date(row.original.time).toLocaleDateString(undefined, {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </T3>
                <T3>
                  Trade: <FormattedNumber num={row.original.price_start} notation="standard" /> -{' '}
                  <FormattedNumber num={row.original.price_end} notation="standard" />
                </T3>
                <T3>Value: ${<FormattedNumber num={row.original.usd_value} notation="standard" />}</T3>
                <T3>Fees: ${<FormattedNumber num={row.original.fees_usd} notation="standard" />}</T3>
                <T3>Slippage: {<FormattedNumber num={row.original.slippage * 100} notation="standard" />}%</T3>
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
})
TradeHistoryRow.displayName = 'TradeHistoryRow'

export default TradeHistoryRow
