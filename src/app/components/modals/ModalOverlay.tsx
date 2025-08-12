import { colors } from '../../constants/colors'

export interface IModalOverlay {
  onClose: () => void
  showOverlay: boolean
}

const ModalOverlay = ({ onClose, showOverlay = true }: IModalOverlay) => (
  <div
    className={`fixed h-full w-full left-0 top-0`}
    onClick={onClose}
    style={{ backgroundColor: colors.black, opacity: showOverlay ? 0.61 : 0 }}
  ></div>
)

export default ModalOverlay
