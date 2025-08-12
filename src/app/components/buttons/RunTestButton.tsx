const Loader = 'https://assets.oku.trade/loader.svg'

interface IButton {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}
export default function RunTestButton({ onClick, disabled, loading }: IButton) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[108px] h-[30px] flex items-center justify-center rounded-md text-gray-50 disabled:text-blue-400 hover:bg-blue-500 bg-blue-400 disabled:bg-gray-800`}
    >
      {loading ? (
        <img src={Loader} alt="spinning loader" className="h-[16px] center mx-auto my-4 animate-spin" />
      ) : (
        <div className={`font-semibold text-xs`}>Run back tests</div>
      )}
    </button>
  )
}
