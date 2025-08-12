import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'

interface IButton {
  onClick: () => void
  disabled: boolean
  isPlus?: boolean
}

export default function IncrementButton(props: IButton) {
  const { onClick, disabled, isPlus = true } = props
  const [hover, setHover] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  let timeoutId: NodeJS.Timeout | null = null

  useEffect(() => {
    return () => onMouseUpOrLeaveHandler()
  }, [])

  useEffect(() => {
    const onMouseUp = () => onMouseUpOrLeaveHandler()
    document.addEventListener('mouseup', onMouseUp)
    return () => document.removeEventListener('mouseup', onMouseUp)
  }, [])

  const onMouseDownHandler = () => {
    if (timerRef.current) return

    const delay = 50 // delay in ms
    let postInitial = 400
    timeoutId = setTimeout(function run() {
      onClick()
      postInitial = Math.max(postInitial - 50, 50)
      timerRef.current = setTimeout(run, postInitial)
    }, delay)
  }

  const onMouseUpOrLeaveHandler = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  return (
    <button
      onMouseDown={onMouseDownHandler}
      onMouseUp={onMouseUpOrLeaveHandler}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        onMouseUpOrLeaveHandler()
      }}
      className={`h-4 w-4 rounded-[4px] flex items-center justify-center ${disabled ? 'hidden' : ''}`}
      style={{ backgroundColor: hover ? getHoverColor(colors.gray[750]) : colors.gray[750] }}
    >
      {isPlus ? (
        <PlusIcon width={10} color={hover ? getHoverColor(colors.white) : colors.white}></PlusIcon>
      ) : (
        <MinusIcon width={10} color={hover ? getHoverColor(colors.white) : colors.white}></MinusIcon>
      )}
    </button>
  )
}
