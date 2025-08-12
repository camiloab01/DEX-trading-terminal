import { escapeRegExp } from '../../util/escapeRegExp'
import { memo } from 'react'

export const Input = memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  prependSymbol,
  decimals = 18,
  classes = '',
  ...rest
}: {
  value: string | number
  onUserInput: (input: string) => void
  error?: boolean
  prependSymbol?: string | undefined
  decimals?: number
  classes?: string
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string, maxDecimals = 18) => {
    const inputRegex = RegExp(`^\\d*(?:\\\\.)?\\d{0,${maxDecimals}}$`)
    const forbiddenChars = ['*', '?', '(', ')', '[', ']', '{', '}', '\\', '|', '^', '$', '+']

    // Reject forbiddenChars
    if (forbiddenChars.some((char) => nextUserInput.includes(char))) return
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) onUserInput(nextUserInput)
  }

  return (
    <input
      {...rest}
      value={prependSymbol ? prependSymbol + value : value}
      onChange={(event) => {
        if (prependSymbol) {
          const value = event.target.value
          window.log.log(value)
          const formattedValue = value.toString().includes(prependSymbol)
            ? value.toString().slice(1, value.toString().length + 1)
            : value
          // replace commas with periods
          enforcer(formattedValue.replace(/,/g, '.'), decimals)
        } else enforcer(event.target.value.replace(/,/g, '.'), decimals)
      }}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
      className={`bg-black_transparent w-full border-none border-[0px] focus-within:outline-none placeholder-gray-600 ${classes}`}
    />
  )
})

export default Input
