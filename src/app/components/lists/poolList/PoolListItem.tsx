import { FormattedNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import getPriceOfPool from '../../../util/getPriceOfPool'
import { IPoolSummary } from '../../../data/search_pools'
import StarButton from '../../buttons/StarButton'
import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '../../../context/ThemeContext'
import { TokenSymbol } from '../../misc/TokenSymbol'

interface IPoolListItem {
  pool: IPoolSummary
  isStarred: boolean
  togglePool: (pool_address: string) => void
  onClose: () => void
}

export default function PoolListItem(props: IPoolListItem) {
  const { pool, isStarred, togglePool } = props
  const change = pool.is_preferred_token_order ? pool.t0_change : pool.t1_change
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { colors: themeColors } = useThemeContext()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      root: null,
      rootMargin: '0px',
      threshold: 0.8,
    })
    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <div ref={ref} className={`duration-75 mb-1 transition-opacity ${isVisible ? 'opacity-1' : 'opacity-0 '}`}>
      <NavLink
        to={`../${pool.address}`}
        relative="path"
        className="px-1 mx-1 rounded-[4px] flex flex-row items-center hover:bg-gray-800"
        style={({ isActive }) => ({
          backgroundColor: isActive ? colors.gray[800] : undefined,
        })}
        end
      >
        <div className="flex flex-row w-full justify-between text-[12px] font-normal  py-1 ">
          <div className="flex flex-row flex-[35] whitespace-pre">
            <T3 color="text-gray-100">
              <TokenSymbol address={pool.t0} fallback_name={pool.t0_symbol} shortenSymbol />
            </T3>
            <T3 color={colors.gray[400]}>
              /<TokenSymbol address={pool.t1} fallback_name={pool.t1_symbol} shortenSymbol />
            </T3>
          </div>
          <div className="flex flex-[15] justify-end">
            <T3 color={colors.gray[400]}>{pool.fee / 10000}%</T3>
          </div>
          <div className="flex flex-[30] justify-end text-xs">
            <T3 color="text-gray-100">
              <FormattedNumber num={getPriceOfPool(pool)} />
            </T3>
          </div>
          <div className="flex flex-[26] justify-center">
            <T3 color={change >= 0 ? themeColors.pos_color : themeColors.neg_color}>
              {change >= 0 ? '+' : '-'}
              <FormattedNumber num={Math.abs(change * 100)} belowOneDecimalAmount={2} notation="standard" />%
            </T3>
          </div>
        </div>
        <StarButton onClick={() => togglePool(pool.address)} isStarred={isStarred} />
      </NavLink>
    </div>
  )
}
