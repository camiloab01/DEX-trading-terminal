import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { getHoverColor } from '../charts/utils/getHoverColor'
import ModalOverlay from '../modals/ModalOverlay'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

function InvalidLimitOrderPool() {
  const [hover, setHover] = useState(false)
  const onClose = () => setHover(false)
  const onRequest = () => {
    onClose()
    window.log.log('request')
    window.open('https://discord.gg/RcGZB3X4q9')
  }
  return (
    <div className="flex items-center">
      {hover && <ModalOverlay onClose={onClose} showOverlay={true} />}
      {hover && <RequestPoolDisplay onRequest={onRequest} />}
      <button onMouseEnter={() => setHover(true)} onClick={() => setHover(true)}>
        <InformationCircleIcon width={24} fill={colors.gray[800]} stroke={colors.gray[600]} className="mr-2" />
      </button>
    </div>
  )
}

export default InvalidLimitOrderPool

interface IRequestPoolDisplay {
  onRequest: () => void
}

const RequestPoolDisplay = (props: IRequestPoolDisplay) => {
  const { onRequest } = props
  return (
    <div
      className="absolute w-[232px] h-[86px] bg-red-20 rounded-[20px] p-3 flex flex-col justify-between "
      style={{ marginTop: -112, backgroundColor: colors.gray[700] }}
    >
      <div className="flex flex-row flex-wrap justify-center items-center gap-1 text-left">
        <T3>Request limit order be added to this market via Discord.</T3>
      </div>
      <RequestButton onRequest={onRequest} />
    </div>
  )
}

interface iRequestButton {
  onRequest: () => void
}

const RequestButton = (props: iRequestButton) => {
  const { onRequest } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onRequest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`w-[212px] h-[26px] rounded-[6px]`}
      style={{ backgroundColor: hover ? getHoverColor(colors.blue[400]) : colors.blue[400] }}
    >
      <T3 weight={FontWeightEnums.SEMIBOLD}>Request</T3>
    </button>
  )
}
