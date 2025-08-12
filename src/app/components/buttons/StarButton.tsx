import { StarIcon } from '@heroicons/react/24/outline'

interface IStarButton {
  onClick: (event: any) => void
  isStarred: boolean
}

export default function StarButton(props: IStarButton) {
  const { isStarred, onClick } = props
  return (
    <button className="cursor-pointer" onClick={onClick}>
      <StarIcon fill={isStarred ? 'white' : 'null'} className="w-4 h-4" stroke="white" />
    </button>
  )
}
