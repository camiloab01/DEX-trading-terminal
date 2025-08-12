import { colors } from '../../constants/colors'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

export const CopyText = ({ copyText }: { copyText: string }) => {
  const [, copy] = useCopyToClipboard()
  const [isCopied, setIsCopied] = useState(false)
  const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    copy(copyText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1000)
  }
  return (
    <div
      className="flex items-center justify-center text-current w-3 h-3 text-inherit color-inherit hover:text-gray-600 relative transform transition duration-75 ease-in active:scale-90 z-10"
      onClick={onClickHandler}
    >
      {isCopied ? (
        <>
          <div
            className={`absolute left-0 top-5 border border-solid	 border-gray-800 p-1 bg-gray-900  text-sm rounded-md z-10 text-gray-300`}
          >
            Copied!
          </div>
          <CheckCircleIcon color={colors.gray[50]} />
        </>
      ) : (
        <CopyBoxesIcon />
      )}
    </div>
  )
}

const CopyBoxesIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.15 1.15625H3.78C3.67259 1.15625 3.56957 1.19892 3.49362 1.27487C3.41767 1.35082 3.375 1.45384 3.375 1.56125V8.85625C3.375 8.96366 3.41767 9.06668 3.49362 9.14263C3.56957 9.21858 3.67259 9.26125 3.78 9.26125H9.375C9.42795 9.26125 9.48038 9.25074 9.52924 9.23033C9.5781 9.20992 9.62242 9.18001 9.65963 9.14233C9.69683 9.10466 9.72619 9.05997 9.746 9.01086C9.7658 8.96175 9.77566 8.9092 9.775 8.85625V2.79625"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.21503 4.1375V10.0925C2.21558 10.1564 2.22915 10.2195 2.25493 10.278C2.2807 10.3365 2.31813 10.3891 2.36493 10.4326C2.41173 10.4761 2.46692 10.5097 2.52711 10.5311C2.58731 10.5526 2.65125 10.5616 2.71503 10.5575H7.30003M7.79503 2.7575C7.79503 2.86359 7.83717 2.96533 7.91218 3.04034C7.9872 3.11536 8.08894 3.1575 8.19503 3.1575H9.35003C9.45611 3.1575 9.55786 3.11536 9.63287 3.04034C9.70788 2.96533 9.75003 2.86359 9.75003 2.7575L8.19503 1.1875C8.08894 1.1875 7.9872 1.22964 7.91218 1.30466C7.83717 1.37967 7.79503 1.48141 7.79503 1.5875V2.7575Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
