import { T3 } from '../../typography/Typography'
import { FormattedNumber } from '../../numbers/FormatNumber'
import { useThemeContext } from '../../../context/ThemeContext'
import { useDataContext } from '../../../context/DataContext'
import { Swap } from '@gfxlabs/oku'
import { Row } from '@tanstack/react-table'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { linkExplorer } from '../../../util/linkBlockexplorer'
import { useChainLoader } from '../../../route/loaderData'
import { colors } from '../../../constants/colors'

interface ITradeHistoryCell {
  row: Row<Swap>
  type: string
  isPos: boolean
  firstRowFont: string
}

export default function TradeHistoryCell({ row, type, isPos, firstRowFont }: ITradeHistoryCell) {
  const { token } = useDataContext()
  const { currentChainInfo } = useChainLoader()
  const { colors: themeColors } = useThemeContext()

  const renderCellContent = () => {
    switch (type) {
      case 'avg_price':
        const avgPrice = token.selected === 0 ? 1 / row.original.avg_price : row.original.avg_price
        return (
          <T3 color={isPos ? themeColors.pos_color : themeColors.neg_color} className="flex min-w-[64px]">
            <FormattedNumber num={avgPrice} smallNumberOn2Zeros={true} notation="standard" />
          </T3>
        )
      case 'amount1':
        const amount = token.selected === 0 ? row.original.amount1 : row.original.amount0
        return (
          <T3 color={firstRowFont} className="flex min-w-[72px] justify-end">
            <FormattedNumber num={amount} />
          </T3>
        )
      case 'time':
        return (
          <T3 className="flex min-w-[48px] justify-end" color={firstRowFont}>
            {new Date(row.original.time).toLocaleTimeString()}
          </T3>
        )
      case 'transaction':
        const transaction = row.original.transaction
        const url = linkExplorer('tx', transaction.toString(), currentChainInfo.id)
        return (
          <T3 className="flex min-w-[13px] justify-end" color={firstRowFont}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ArrowTopRightOnSquareIcon height={12} width={12} color={colors.gray[400]} />
            </a>
          </T3>
        )
      default:
        return null
    }
  }
  return renderCellContent()
}
