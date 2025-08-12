import { useState } from 'react'

export const useMouseDrag = () => {
  const [dragStartTick, setDragStartTick] = useState<number | undefined>(undefined)
  const [dragStopTick, setDragStopTick] = useState<number | undefined>(undefined)

  return {
    dragStartTick,
    dragStopTick,
    setDragStartTick,
    setDragStopTick,
  }
}
