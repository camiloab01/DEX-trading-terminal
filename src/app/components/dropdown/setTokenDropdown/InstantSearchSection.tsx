import { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { Configure, InstantSearch, UseSearchBoxProps, useInstantSearch, useSearchBox } from 'react-instantsearch-core'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import { useChainLoader } from '../../../route/loaderData'
import SearchDropdownInput from '../../inputs/SearchDropdownInput'
import { InfiniteHits } from './HitList'
import { T2, T3, T4 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums } from '../../../types/Enums'
import { RoundTokenLogo } from '../../misc/RoundTokenLogo'
import { IToken } from '../../../lib/getToken'
import { useConfigContext } from '../../../context/ConfigContext'

const SearchInput = (props: UseSearchBoxProps & { input: string; setInput: (val: string) => void }) => {
  const { input, setInput, ...searchBoxProps } = props
  const { refine } = useSearchBox(searchBoxProps)
  useInstantSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  function setQuery(newQuery: string) {
    setInput(newQuery)
    refine(newQuery)
  }
  return (
    <div className="px-2 pb-4">
      <form
        action=""
        role="search"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (inputRef.current) inputRef.current.blur()
        }}
        onReset={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setQuery('')
          if (inputRef.current) inputRef.current.focus()
        }}
      >
        <SearchDropdownInput
          innerRef={inputRef}
          onChange={(value) => {
            setQuery(value)
          }}
          value={input}
          bgColor="bg-gray-750"
          borderColor="border-gray-700"
        />
      </form>
    </div>
  )
}
interface InstantSearchSectionProps {
  setToken: (value: IToken) => void
  selectedToken: IToken | undefined
  input: string
  setInput: (val: string) => void
  liquidityPage?: boolean
  balanceTokens?: IToken[]
  tokenDropdown?: boolean
}

const typesenseInstantsearchAdapter = (url: string) =>
  new TypesenseInstantSearchAdapter({
    server: {
      apiKey: '',
      nodes: [{ url: `${url}/search/typesense` }],
      cacheSearchResultsForSeconds: 2 * 60,
    },
    additionalSearchParameters: {
      query_by: 'name,description,tags,address,symbol',
      sort_by: 'score:desc,_text_match:desc',
    },
  })

export const InstantSearchSection = ({
  setToken,
  selectedToken,
  input,
  setInput,
  balanceTokens,
}: PropsWithChildren<InstantSearchSectionProps>) => {
  const { currentChainInfo } = useChainLoader()
  const {
    features: { Accounts },
  } = useConfigContext()
  const tsAdapter = useMemo(() => typesenseInstantsearchAdapter(Accounts.url), [Accounts.url])
  const facetFilters = useMemo(() => [`chain_name:${currentChainInfo.internalName}`], [currentChainInfo])
  const [tokenToImport, setTokenToImport] = useState<IToken>()
  const [showTokenImportWarning, setShowTokenImportWarning] = useState<boolean>(false)
  const [understandTokenImportWarning, setUnderstandTokenImportWarning] = useState<boolean>(false)
  const handleImportToken = () => {
    if (tokenToImport) {
      setToken(tokenToImport)
      localStorage.setItem(
        `Token_${currentChainInfo.id}_${tokenToImport.address.toLowerCase()}`,
        JSON.stringify(tokenToImport)
      )
      localStorage.setItem(
        `Token_${currentChainInfo.id}_${tokenToImport.symbol?.toLowerCase()}`,
        JSON.stringify(tokenToImport)
      )
    }
  }

  return (
    <InstantSearch indexName="erc20_tokens" searchClient={tsAdapter.searchClient}>
      <Configure facetFilters={facetFilters} sumOrFiltersScores={true} advancedSyntax={true} distinct={true} />
      {showTokenImportWarning && (
        <div className="flex flex-col gap-4 border-[1px] border-gold-200 bg-gold-200/20 rounded-lg text-center m-2 px-2 py-3 w-80">
          <T2 color={colors.gray[100]}>
            Anyone can create tokens on Ethereum with any name, including creating fake versions of existing tokens and
            tokens that claim to represent projects that do not have a token.{' '}
          </T2>
          <T2 color={colors.gray[100]} weight={FontWeightEnums.SEMIBOLD}>
            If you purchase a fraudulent token, you may be exposed to permanent loss of funds.
          </T2>
        </div>
      )}
      {tokenToImport ? (
        <div className="flex flex-col">
          <div className="flex flex-row justify-between p-2">
            <div className="flex flex-row">
              <div className="mt-1 mr-2">
                <RoundTokenLogo tokenSymbol={tokenToImport.symbol} size={14} />
              </div>
              <div className="flex flex-col gap-y-1 items-start">
                <T2 className="whitespace-pre" color={colors.gray[100]}>
                  {tokenToImport.name && tokenToImport.name.trim().length > 0
                    ? tokenToImport.name.length > 24
                      ? tokenToImport.name.slice(0, 16) + '...' + tokenToImport.name.slice(-4).trim()
                      : tokenToImport.name
                    : tokenToImport.address}
                </T2>
                <T4 className="whitespace-pre" color={colors.gray[400]}>
                  {tokenToImport.symbol}
                </T4>
              </div>
            </div>
            {showTokenImportWarning ? (
              <></>
            ) : (
              <button
                className="flex gap-1 items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-md w-[112px] h-[32px] border border-blue-500"
                onClick={() => setShowTokenImportWarning(true)}
              >
                <T3>Import</T3>
              </button>
            )}
          </div>
          {showTokenImportWarning && (
            <>
              <div className="flex p-2 gap-3">
                <input
                  type="checkbox"
                  checked={understandTokenImportWarning}
                  onChange={() => setUnderstandTokenImportWarning(!understandTokenImportWarning)}
                />
                <T2 color={colors.gray[50]}>I understand</T2>
              </div>
              <div className="p-2">
                <button
                  className="bg-blue-400 hover:enabled:bg-blue-500 rounded-md w-full h-[32px] border border-blue-500"
                  onClick={handleImportToken}
                  disabled={!understandTokenImportWarning}
                >
                  <T3>Import</T3>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <SearchInput input={input} setInput={setInput} />
          <InfiniteHits
            setTokenToImport={setTokenToImport}
            setToken={setToken}
            balanceTokens={balanceTokens}
            input={input}
            selectedToken={selectedToken}
          />
        </>
      )}
    </InstantSearch>
  )
}
