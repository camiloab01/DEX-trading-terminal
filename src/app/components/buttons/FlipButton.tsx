import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function FlipButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      className={`w-[20px] h-[20px]  rounded flex items-center justify-center border border-gray-700 bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-gray-100`}
      disabled={disabled}
      onClick={onClick}
    >
      <ArrowRightIcon color={'inherit'} width={12} />
    </button>
  )
}
