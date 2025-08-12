import { useEffect, useState } from 'react'
import { colors } from '../../../constants/colors'
import { useDataContext } from '../../../context/DataContext'
import { useNetworkContext } from '../../../context/NetworkContext'
import { poolToData } from '../../../contracts/limitOrder'
import { useOrderFormTypeQueryParam } from '../../../hooks/useQueryParams'
import { getLocalStorageItem } from '../../../lib/localStorage'
import { zarazTrack } from '../../../lib/zaraz'
import { useChainLoader } from '../../../route/loaderData'
import { FontWeightEnums, OrderFormTypeEnums } from '../../../types/Enums'
import OrderFormDropdown, { IOrderSettings } from '../../dropdown/OrderFormDropdown'
import { T2 } from '../../typography/Typography'
import LimitOrderForm from './LimitOrderForm'
import MarketOrderForm from './Swap/MarketOrderForm'

export default function OrderFormContainer({
  showLimit = false,
  isSwapForm = false,
  navigateAfterTokenSelection,
}: {
  showLimit?: boolean
  isSwapForm?: boolean
  navigateAfterTokenSelection?: boolean
}) {
  const [orderForm, setOrderForm] = useState(isSwapForm ? OrderFormTypeEnums.SWAP : OrderFormTypeEnums.MARKET)
  const [slippage] = useState(getLocalStorageItem('slippage') || '0.500')
  const [settings, setSettings] = useState<IOrderSettings>({
    slippage: parseFloat(slippage),
    transactionDeadline: 30,
    refreshSeconds: 15,
  })
  const { poolAddress } = useDataContext()
  const { provider } = useNetworkContext()
  const { currentChain, currentChainInfo } = useChainLoader()
  const [, orderFormTypeQuery] = useOrderFormTypeQueryParam('orderFormType')

  useEffect(() => {
    if (orderFormTypeQuery) setOrderForm(orderFormTypeQuery as OrderFormTypeEnums)
  }, [orderFormTypeQuery])

  useEffect(() => {
    if (isSwapForm) return
    if (poolAddress == undefined || provider == undefined || currentChain == undefined || currentChainInfo == undefined)
      return
    if (currentChainInfo.contracts == undefined || currentChainInfo.contracts.limitOrder == undefined) return
    poolToData({ pool: poolAddress, provider, contract: currentChainInfo.contracts.limitOrder.address }).then((res) => {
      if (res != null && res[4] !== 0 && orderFormTypeQuery !== OrderFormTypeEnums.MARKET) {
        setOrderForm(OrderFormTypeEnums.LIMIT)
      } else {
        setOrderForm(isSwapForm ? OrderFormTypeEnums.SWAP : OrderFormTypeEnums.MARKET)
      }
    })
  }, [poolAddress, currentChain])

  return (
    <div className="bg-gray-900 rounded-xl h-full flex flex-1 flex-col p-2 border border-gray-800">
      <div className="flex flex-1 flex-col gap-y-1">
        <div className="flex justify-between items-center">
          <ChooseForm orderForm={orderForm} isSwapForm={isSwapForm} showLimit={showLimit} setOrderForm={setOrderForm} />
          {orderForm !== OrderFormTypeEnums.LIMIT && (
            <OrderFormDropdown settings={settings} setSettings={setSettings} />
          )}
        </div>
        {OrderFormSwitch(orderForm, settings, isSwapForm, navigateAfterTokenSelection)}
      </div>
    </div>
  )
}

interface IOrderFormButton {
  onClick: () => void
  orderFormChosen: OrderFormTypeEnums
  children: string
  orderForm: OrderFormTypeEnums
  isSwapForm?: boolean
}

const ChooseFormButton = (props: IOrderFormButton) => {
  const { onClick, orderFormChosen, children, orderForm, isSwapForm } = props
  const [setOrderFormType] = useOrderFormTypeQueryParam('orderFormType')
  return (
    <button
      onClick={onClick}
      className={`flex items-center rounded-lg ${isSwapForm ? 'p-1 text-gray-50' : 'p-2 text-gray-400 hover:bg-gray-750 hover:text-gray-100'}  
      ${orderForm === orderFormChosen && !isSwapForm ? 'bg-gray-750' : ''}`}
      disabled={isSwapForm}
      onFocus={() => setOrderFormType(orderFormChosen)}
    >
      <T2
        weight={FontWeightEnums.MEDIUM}
        color={orderForm === orderFormChosen && !isSwapForm ? colors.gray[100] : 'inherit'}
      >
        {children}
      </T2>
    </button>
  )
}

const ChooseForm = ({
  orderForm,
  setOrderForm,
  showLimit,
  isSwapForm,
}: {
  orderForm: OrderFormTypeEnums
  setOrderForm: (type: OrderFormTypeEnums) => void
  showLimit: boolean
  isSwapForm: boolean
}) => {
  const { currentChainInfo } = useChainLoader()
  const { poolAddress } = useDataContext()
  return (
    <div className="flex flex-row gap-3 text-white text-[14px] font-normal">
      <ChooseFormButton
        onClick={() => {
          zarazTrack('market_click', { chain: currentChainInfo.name, pool: poolAddress })
          setOrderForm(OrderFormTypeEnums.MARKET)
        }}
        orderFormChosen={OrderFormTypeEnums.MARKET}
        orderForm={orderForm}
        isSwapForm={isSwapForm}
      >
        {isSwapForm ? 'Swap' : 'Market'}
      </ChooseFormButton>
      {showLimit && (
        <ChooseFormButton
          onClick={() => {
            zarazTrack('limit_click', { chain: currentChainInfo.name, pool: poolAddress })
            setOrderForm(OrderFormTypeEnums.LIMIT)
          }}
          orderFormChosen={OrderFormTypeEnums.LIMIT}
          orderForm={orderForm}
          isSwapForm={isSwapForm}
        >
          Limit
        </ChooseFormButton>
      )}
    </div>
  )
}

const OrderFormSwitch = (
  orderForm: OrderFormTypeEnums,
  settings: IOrderSettings,
  isSwapForm: boolean,
  navigateAfterTokenSelection?: boolean
) => {
  switch (orderForm) {
    case OrderFormTypeEnums.LIMIT:
      return <LimitOrderForm />
    case OrderFormTypeEnums.MARKET:
      return (
        <MarketOrderForm
          settings={settings}
          isSwapForm={isSwapForm}
          navigateAfterTokenSelection={navigateAfterTokenSelection}
        />
      )
    default:
      return (
        <MarketOrderForm
          settings={settings}
          isSwapForm={isSwapForm}
          navigateAfterTokenSelection={navigateAfterTokenSelection}
        />
      )
  }
}
