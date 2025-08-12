import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { calculatePercentages } from '../../util/calculateFeeTierPercentages'
import { liquidityPath } from '../../util/pathHelper'
import { useDataContext } from '../../context/DataContext'
import { PoolSummary } from '@gfxlabs/oku'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { GoChevronDown } from 'react-icons/go'
import { useCurrentClient } from '../../hooks/useClient'
import { useChainLoader } from '../../route/loaderData'

const FACTOR = 10000

const feeTierSwitch = (fee: number) => {
  switch (fee) {
    case 100:
      return 'Very Stable Pools'
    case 500:
      return 'Stable Pools'
    case 3000:
      return 'Standard'
    case 10000:
      return 'Exotic Pools'
  }
}

interface IFeeTierButton {
  pool: PoolSummary
  setFee: (fee: number) => void
  feeTierPercentage: string
  setIsOpen: (value: boolean) => void
}

function FeeTierDropdown() {
  const { poolSummary } = useDataContext()
  const [fee, setFee] = useState<undefined | number>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 1,
      transform: 'scale(0,0)',
    },
    common: {
      transformOrigin: `top`,
    },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  const { data: pools } = useCurrentClient('cush_search', [[poolSummary.t0, poolSummary.t1].join('/')])
  const { data: feeTiers } = useCurrentClient('cush_getFeeTiersPositionCount', [poolSummary.t0, poolSummary.t1])

  useEffect(() => {
    if (poolSummary != undefined && poolSummary.fee != undefined) setFee(poolSummary.fee)
  }, [poolSummary])

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="gap-1 border text-white text-xs font-semibold py-2 px-[10px] bg-gray-900 border-gray-750 rounded-md flex justify-between cursor-pointer items-center"
      >
        <DropdownButton fee={fee} />
        <GoChevronDown style={{ color: colors.gray[400] }} />
      </div>
      {isOpen && (
        <div className="w-full mt-1" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div style={styles} className="w-full flex flex-col bg-gray-750 border border-gray-700 rounded-lg">
            <DropdownModal pools={pools?.pools} setFee={setFee} feeTiers={feeTiers} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </>
  )
}

const DropdownModal = ({
  pools,
  setFee,
  feeTiers,
  setIsOpen,
}: {
  pools: PoolSummary[] | undefined
  setFee: (fee: number) => void
  feeTiers: { [fee: number]: number } | undefined
  setIsOpen: (value: boolean) => void
}) => {
  const feeTierPercentages = calculatePercentages(feeTiers)
  return (
    <>
      {pools &&
        pools
          .sort((x, y) => {
            return x.fee - y.fee
          })
          .map((pool, index) => (
            <FeeButton
              key={index}
              pool={pool}
              setFee={setFee}
              feeTierPercentage={feeTierPercentages[pool.fee] || '0'}
              setIsOpen={setIsOpen}
            />
          ))}
    </>
  )
}

const DropdownButton = ({ fee }: { fee: number | undefined }) => (
  <T3>{fee != undefined ? (fee / FACTOR).toString().concat('% Fee tier') : 'Loading...'}</T3>
)

const FeeButton = (props: IFeeTierButton) => {
  const { pool, setFee, feeTierPercentage, setIsOpen } = props
  const navigate = useNavigate()
  const { currentChainInfo } = useChainLoader()

  return (
    <div
      className="text-white flex justify-start px-2 py-2 hover:bg-gray-drophover w-full cursor-pointer rounded-lg"
      onClick={() => {
        setFee(pool.fee)
        navigate(liquidityPath(pool.address, currentChainInfo.internalName))
        setIsOpen(false)
      }}
    >
      <div className="w-[56px] flex flex-start">
        <T3 weight={FontWeightEnums.MEDIUM}>{(pool.fee / FACTOR).toString().concat('%')}</T3>
      </div>
      <div className="flex flex-row justify-between w-full">
        <T3 color={colors.gray[500]}>{feeTierSwitch(pool.fee)}</T3>
        <T3 color={colors.blue[400]}>{feeTierPercentage.concat('%')} select</T3>
      </div>
    </div>
  )
}

export default FeeTierDropdown
