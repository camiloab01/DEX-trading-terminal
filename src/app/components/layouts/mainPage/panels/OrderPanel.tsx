import OrderFormContainer from '../../../forms/OrderForms/OrderFormContainer'
import OrderHistory from '../../../lists/orderHistory/mainPage/OrderHistory'

const OrderPanel = () => (
  <div className={`flex flex-col lg:flex-row md:col-start-2 md:col-end-4 gap-1.5 w-full row-start-3 md:row-start-2`}>
    <div className={`flex-1 w-full md:max-w-[500px] h-full lg:min-w-[350px]`}>
      <OrderFormContainer showLimit />
    </div>
    <div className={`grow flex flex-1 h-full`}>
      <OrderHistory />
    </div>
  </div>
)
export default OrderPanel
