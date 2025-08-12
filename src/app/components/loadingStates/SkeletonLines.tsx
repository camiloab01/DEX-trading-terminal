export const SkeletonLines = ({ lines, random = false }: { lines: number; random?: boolean }) => {
  const randomLinesWidths = ['w-[50%]', 'w-[60%]', 'w-[70%]', 'w-[80%]', 'w-[90%]', 'w-[100%]']
  const skeletonLines = Array.from({ length: lines }, (_, i) => i).map((i) => {
    const width = random ? randomLinesWidths[Math.floor(Math.random() * randomLinesWidths.length)] : 'w-full'
    return <div className={`h-2 rounded-full dark:bg-gray-800 ${width} my-3`} key={i}></div>
  })
  return (
    <div role="status" className="animate-pulse px-2 w-full">
      {skeletonLines}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
