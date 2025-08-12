import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import styles from './orderBanner.module.css'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, createContext, ReactElement, useContext, useRef, useEffect } from 'react'
import { linkExplorer } from '../../util/linkBlockexplorer'
import { TransactionType } from '../../context/TransactionsContext'
import { Trans } from '@lingui/macro'
import { FontWeightEnums } from '../../types/Enums'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export const SpinIcon = () => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      className="animate-spin"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="mask0_702_848" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <path d="M5.15625 5.15625H19.8437V19.8437H5.15625V5.15625Z" fill="white" />
      </mask>
      <g mask="url(#mask0_702_848)">
        <path
          d="M12.5 17.3438C9.80469 17.3438 7.65625 15.1562 7.65625 12.5C7.65625 9.80469 9.84375 7.65625 12.5 7.65625C15.1562 7.65625 17.3438 9.80469 17.3438 12.5C17.3438 15.1953 15.1953 17.3438 12.5 17.3438ZM12.5 5.15625C8.4375 5.15625 5.15625 8.47656 5.15625 12.5C5.15625 16.5625 8.47656 19.8437 12.5 19.8437C16.5234 19.8437 19.8437 16.5625 19.8437 12.5C19.8437 8.4375 16.5625 5.15625 12.5 5.15625Z"
          fill={colors.gray[300]}
        />
      </g>
      <mask id="mask1_702_848" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <path d="M5.15625 5.15625H19.8437V19.8437H5.15625V5.15625Z" fill="white" />
      </mask>
      <g mask="url(#mask1_702_848)">
        <path
          d="M18.5937 11.25C17.8906 11.25 17.3438 11.7969 17.3438 12.5C17.3438 15.1953 15.1562 17.3438 12.5 17.3438C9.84375 17.3438 7.65625 15.1953 7.65625 12.5C7.65625 9.80469 9.80469 7.65625 12.5 7.65625C13.2031 7.65625 13.75 7.10937 13.75 6.40625C13.75 5.70312 13.2031 5.15625 12.5 5.15625C8.4375 5.15625 5.15625 8.47656 5.15625 12.5C5.15625 16.5234 8.4375 19.8437 12.5 19.8437C16.5625 19.8437 19.8437 16.5625 19.8437 12.5C19.8437 11.7969 19.2969 11.25 18.5937 11.25Z"
          fill={colors.blue[400]}
        />
      </g>
    </svg>
  )
}

export enum OrderBannerEnums {
  EXECUTE_TRADE,
  EXECUTE_TRADE_IN_PROGRESS,
  EXECUTE_TRADE_SUCCESS,
  EXECUTE_TRADE_ERROR,
  SIGNATURE,
  SIGNATURE_IN_PROGRESS,
  SIGNATURE_SUCCESS,
  SIGNATURE_ERROR,
  TOKEN_APPROVAL,
  TOKEN_APPROVAL_IN_PROGRESS,
  TOKEN_APPROVAL_SUCCESS,
  TOKEN_APPROVAL_ERROR,
  EXECUTE_CLAIM,
  EXECUTE_CLAIM_IN_PROGRESS,
  EXECUTE_CLAIM_SUCCESS,
  EXECUTE_CLAIM_ERROR,
  EXECUTE_CANCEL,
  EXECUTE_CANCEL_IN_PROGRESS,
  EXECUTE_CANCEL_SUCCESS,
  EXECUTE_CANCEL_ERROR,
  EXECUTE_TRANSACTION,
  EXECUTE_TRANSACTION_IN_PROGRESS,
  EXECUTE_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION_ERROR,
  EXECUTE_SLIPPAGE_ERROR,
  QUOTE_ERROR,
}

interface IOrderBanner {
  id: number
  type: TransactionType
  state: OrderBannerEnums
  txHash: undefined | string
  chainId: number
}

function getInfo(otype: OrderBannerEnums): { title: string; info: string; icon: JSX.Element } {
  const s = OrderBannerEnums[otype]
  let title: string
  let info: string
  let icon = <SpinIcon />
  if (s.endsWith('IN_PROGRESS')) {
    title = 'Transaction in progress'
    info = 'Your status will appear soon'
  } else if (s.endsWith('SUCCESS')) {
    title = 'Transaction successful'
    info = 'View on block explorer'
    icon = <CheckIcon width={20} height={20} color={colors.green[300]} />
  } else if (s.endsWith('SLIPPAGE_ERROR')) {
    title = 'Slippage error'
    info = 'Adjust slippage tolerance and try again.'
    icon = <ExclamationTriangleIcon width={20} height={20} color={colors.yellow['vibrant']} />
  } else if (s.endsWith('ERROR')) {
    title = 'Error'
    info = 'Check your wallet and try again'
    icon = <ExclamationTriangleIcon width={20} height={20} color={colors.yellow['vibrant']} />
  } else {
    const tmp = s.replace('EXECUTE_', '')
    title = `Confirm ${tmp.toLowerCase()} in wallet`
    info = 'To continue with your transaction'
  }
  // special cases
  if (s.startsWith('SIGNATURE')) {
    if (s.endsWith('IN_PROGRESS')) {
      title = 'Signature in progress'
    } else if (s.endsWith('SUCCESS')) {
      title = 'Order signed'
    } else if (s.endsWith('ERROR')) {
      title = 'Error'
    } else {
      title = 'Sign order in wallet'
    }
  } else if (s.startsWith('TOKEN_APPROVAL')) {
    if (s.endsWith('IN_PROGRESS')) {
      title = 'Token approval in progress'
    } else if (s.endsWith('SUCCESS')) {
      title = 'Token approved'
    } else if (s.endsWith('ERROR')) {
      title = 'Error'
    } else {
      title = 'Approve token in wallet'
    }
  }
  return { title, info, icon }
}

export function isSuccess(state: OrderBannerEnums): boolean {
  switch (state) {
    case OrderBannerEnums.EXECUTE_TRADE_SUCCESS:
    case OrderBannerEnums.SIGNATURE_SUCCESS:
    case OrderBannerEnums.TOKEN_APPROVAL_SUCCESS:
    case OrderBannerEnums.EXECUTE_CLAIM_SUCCESS:
    case OrderBannerEnums.EXECUTE_CANCEL_SUCCESS:
    case OrderBannerEnums.EXECUTE_TRANSACTION_SUCCESS:
      return true
    default:
      return false
  }
}

const BannersContext = createContext<{
  // returns the id of the banner just added
  add: (banner: { state: OrderBannerEnums; type: TransactionType; txHash?: string; chainId?: number }) => number
  replace: (
    id: number | undefined,
    banner: { state: OrderBannerEnums; type: TransactionType; txHash?: string; chainId?: number }
  ) => number
}>({ add: () => 0, replace: () => 0 })

const OrderBanner = ({
  id,
  type,
  bannerState,
  transactionHash,
  chainId,
  removeById,
}: {
  id: number
  type: TransactionType
  bannerState: OrderBannerEnums
  transactionHash: undefined | string
  chainId: number
  removeById: (id: number) => void
}) => {
  const [hover, setHover] = useState(false)
  const { title, info, icon } = getInfo(bannerState)
  return (
    <div className={styles.banner}>
      <div
        className="w-[320px] h-[80px] rounded-[8px] flex flex-col gap-[10px] border-[1px] mx-[12px] mb-[12px] mt-0"
        style={{
          backgroundColor: colors.gray[800],
          borderColor: isSuccess(bannerState) ? colors.blue[400] : colors.gray[600],
        }}
      >
        <div
          className="w-full rounded-t-[8px] flex flex-row justify-end gap-[10px] px-[8px] py-[4px]"
          style={{ backgroundColor: isSuccess(bannerState) ? colors.blue[400] : colors.gray[600] }}
        >
          <div className="w-full pl-[4px]">
            <T2 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
              <Trans>{type}</Trans>
            </T2>
          </div>
          <button className="h-fit flex " onClick={() => removeById(id)}>
            <XMarkIcon fill={hover ? getHoverColor(colors.white) : colors.white} width={16} />
          </button>
        </div>
        <div className="flex flex-row items-center gap-[10px] pl-[12px]">
          <div className="p-[2px]">{icon}</div>
          <div className="flex flex-col gap-[4px]">
            <T2 color={colors.gray[100]}>
              <Trans>{title}</Trans>
            </T2>
            {transactionHash ? (
              <a
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                href={linkExplorer('tx', transactionHash, chainId)}
                target="_blank"
                rel="noreferrer"
                className="border-b-[1px] w-fit"
                style={{ borderColor: !hover ? colors.blue[300] : getHoverColor(colors.blue[300]) }}
              >
                <T3 color={!hover ? colors.blue[300] : getHoverColor(colors.blue[300])}>
                  <Trans>{info}</Trans>
                </T3>
              </a>
            ) : (
              <T3 color={!hover ? colors.gray[300] : getHoverColor(colors.gray[300])}>
                <Trans>{info}</Trans>
              </T3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const BannersProvider = ({ children }: { children: ReactElement | ReactElement[] }) => {
  const [orderBanners, setOrderBanners] = useState<IOrderBanner[]>([])
  const count = useRef(0)
  const closeTime = 15000

  function add(newBanner: { state: OrderBannerEnums; type: TransactionType; txHash?: string; chainId?: number }) {
    count.current = count.current + 1
    const banner = {
      id: count.current,
      type: newBanner.type,
      state: newBanner.state,
      txHash: newBanner.txHash ?? undefined,
      chainId: newBanner.chainId ?? 0,
    }
    setOrderBanners((prevBanners) => [...prevBanners, banner])
    if (isSuccess(banner.state)) setTimeout(() => removeById(banner.id), closeTime)
    return count.current
  }

  function removeById(id: number) {
    setOrderBanners((prevBanners) => [...prevBanners.filter((banner) => banner.id !== id)])
  }

  function replace(
    id: number | undefined,
    newBanner: { state: OrderBannerEnums; type: TransactionType; txHash?: string; chainId?: number }
  ) {
    if (id != undefined) removeById(id)
    return add(newBanner)
  }

  useEffect(() => {
    if (orderBanners.length === 0) count.current = 0
  }, [orderBanners])

  return (
    <BannersContext.Provider value={{ add, replace }}>
      {children}
      <div className="fixed right-0 bottom-0 z-[100] flex flex-col-reverse">
        {orderBanners.map((ob: IOrderBanner) => (
          <OrderBanner
            key={ob.id}
            type={ob.type}
            id={ob.id}
            bannerState={ob.state}
            transactionHash={ob.txHash}
            chainId={ob.chainId}
            removeById={removeById}
          />
        ))}
      </div>
    </BannersContext.Provider>
  )
}

export const useBanners = () => useContext(BannersContext)
