import PoolPageLayout from '../components/layouts/mainPage/PoolPageLayout'
import PairRow from '../components/navbar/PairRow'

export const PoolPage = () => {
  return (
    <>
      <div className="pt-2 pb-1 px-1.5">
        <PairRow />
      </div>
      <PoolPageLayout />
    </>
  )
}
