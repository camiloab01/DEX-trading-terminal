interface SortIconProps {
  colorUp: string
  colorDown: string
}
export default function SortIcon({ colorUp, colorDown }: SortIconProps) {
  return (
    <div className="flex items-center justify-start w-5 h-6">
      <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5 13.6371L8.82349 11.1934L7.4682 12.4308L10.8224 15.4933C11.1966 15.835 11.8034 15.835 12.1776 15.4933L15.5318 12.4308L14.1765 11.1934L11.5 13.6371Z"
          fill={colorUp}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5 7.36243L8.82349 9.80621L7.4682 8.56878L10.8224 5.50628C11.1966 5.16457 11.8034 5.16457 12.1776 5.50628L15.5318 8.56878L14.1765 9.80621L11.5 7.36243Z"
          fill={colorDown}
        />
      </svg>
    </div>
  )
}
