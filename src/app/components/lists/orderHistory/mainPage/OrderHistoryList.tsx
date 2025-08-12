import { T2, T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import ExpandOrderHistoryButton from '../../../buttons/ExpandOrderHistoryButton'
import { useAccount } from 'wagmi'
import { Order } from '@gfxlabs/oku'
import OrdersHistoryTable from '../../../tables/OrdersHistoryTable'
import { t } from '@lingui/macro'

export default function OrderHistoryList({ filteredOrders }: { filteredOrders: Order[] | undefined }) {
  const { isConnected } = useAccount()
  const sortedOrders = filteredOrders
    ? filteredOrders.sort(function (a, b) {
        if (b.time != undefined && a.time != undefined) return b.time - a.time
        else return 0
      })
    : []

  return (
    <div className="relative bg-gray-900 rounded-xl text-white p-2 flex flex-col items-center flex-1 border border-gray-800 overflow-hidden max-h-[18rem] min-h-[18rem]">
      <div className="w-full relative flex flex-row justify-between items-center pb-2">
        <div></div>
        <T3 color={colors.gray[200]}>{t`Order History`}</T3>
        <ExpandOrderHistoryButton />
      </div>
      {isConnected ? (
        <div className="overflow-y-scroll no-scrollbar w-full">
          <OrdersHistoryTable historyData={sortedOrders} isOrdersPage={false} />
        </div>
      ) : (
        <div className="flex mt-8">
          <T2 color={colors.gray[300]}>Connect Wallet</T2>
        </div>
      )}
    </div>
  )
}
