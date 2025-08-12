import IconComponent from './IconComponent'

function Refresh(props: IconComponent) {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-4 h-4 ${props.className}`}
    >
      <path
        d="M8.01169 3.67373H10.5077V3.67323M1.49269 8.82172V6.32573M1.49269 6.32573H3.98869M1.49219 6.32573L3.08269 7.91722C3.59475 8.42929 4.23258 8.79753 4.93208 8.98492C5.63158 9.17232 6.36808 9.17226 7.06755 8.98476C7.76702 8.79727 8.40481 8.42893 8.91679 7.91679C9.42877 7.40465 9.79691 6.76675 9.98419 6.06723M2.01569 3.93223C2.20297 3.2327 2.57111 2.5948 3.08309 2.08266C3.59507 1.57052 4.23285 1.20219 4.93232 1.01469C5.63179 0.827189 6.3683 0.827135 7.06779 1.01453C7.76729 1.20192 8.40513 1.57016 8.91719 2.08223L10.5077 3.67323M10.5077 1.17773V3.67273"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Refresh
