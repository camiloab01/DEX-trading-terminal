import { Order } from '@gfxlabs/oku'
import { useUserOrderContext } from '../../../../context/UserOrderContext'
import OrderHistoryDropDown from '../../../dropdown/OrderHistoryDropdown'
import OrderHistoryList from './OrderHistoryList'
import { useEffect, useState } from 'react'

export const OrderHistory = () => {
  const [filter, setFilter] = useState('All')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>()
  const { allUserOrders: orders } = useUserOrderContext()
  useEffect(() => {
    setFilteredOrders(
      orders?.filter(
        (item) => filter === 'All' || item.type === filter.toUpperCase() || item.status === filter.toUpperCase()
      )
    )
  }, [filter, orders])
  return (
    <div className="flex gap-1 flex-col flex-1">
      <OrderHistoryDropDown filter={filter} setFilter={setFilter} />
      <OrderHistoryList filteredOrders={filteredOrders} />
    </div>
  )
}
export default OrderHistory
