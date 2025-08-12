import { ArrowPathIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import { colors } from '../../constants/colors'

export default function FlipTokenPrice({
  onClick,
  color = colors.gray[50],
  hoverColor = colors.gray[400],
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  color?: string
  hoverColor?: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <ArrowPathIcon width={12} color={hover ? hoverColor : color} />
    </button>
  )
}
