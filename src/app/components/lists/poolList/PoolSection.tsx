import { SearchResponse } from '@gfxlabs/oku'
import { searchForPool } from '../../../data/searchForPool'
import PoolDropDown from '../../dropdown/PoolDropDown'
import SearchDropdownInput from '../../inputs/SearchDropdownInput'
import PoolList from './PoolList'
import { useEffect, useState } from 'react'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { useChainLoader } from '../../../route/loaderData'

interface IPoolSection {
  onClose?: () => void
  isModal?: boolean
}

export const PoolSection = (props: IPoolSection) => {
  const { onClose = () => undefined, isModal = false } = props
  const [token, setToken] = useState('Watchlist')
  const [searchResults, setSearchResults] = useState<SearchResponse | undefined>(undefined)
  const [input, setInput] = useState('')
  const [lastToken, setLastToken] = useState('Watchlist')
  const { cushRpc, currentChain } = useChainLoader()

  useEffect(() => setToken('Watchlist'), [currentChain])

  useEffect(() => {
    if (token !== '') {
      setLastToken(token)
      setInput('')
    }
  }, [token])

  useEffect(() => {
    if (input !== '') setToken('')
    else if (input === '' && token === '') setToken(lastToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  const onChange = (val: string) => {
    setInput(val)
    searchForPool(cushRpc, val as unknown as string).then((searchResults) => {
      if (searchResults != undefined && searchResults?.pools?.length > 0) setSearchResults(searchResults)
      else setSearchResults(undefined)
    })
  }

  const breakpoint = useBreakpoint({ base: 0, sm: 1 })
  return (
    <div
      className="flex flex-col gap-1 w-full flex-1 overflow-hidden "
      style={{ maxHeight: isModal ? (breakpoint == 0 ? '100%' : '448px') : '100%', height: isModal ? '448px' : '100%' }}
    >
      <div className="flex flex-row gap-1">
        <SearchDropdownInput onChange={onChange} value={input} width="100%" isPoolSection={true} />
        <div className="w-[120px] ">
          <PoolDropDown token={token} setToken={setToken} />
        </div>
      </div>
      <PoolList token={token} searchResults={searchResults} onClose={onClose} />
    </div>
  )
}

export default PoolSection
