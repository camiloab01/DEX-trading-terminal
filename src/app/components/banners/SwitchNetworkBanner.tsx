import { T1, T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getChainIdFromName } from '../../constants/abi/chainInfo'
import { useEffect, useState } from 'react'
import { useChainLoader } from '../../route/loaderData'
import { useAccount, useSwitchChain } from 'wagmi'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

function SwitchNetworkBanner() {
  const [display, setDisplay] = useState('none')
  const { currentChain, currentChainInfo } = useChainLoader()
  const { chain } = useAccount()
  const { switchChain: switchNetwork, isError, isPending, isSuccess } = useSwitchChain({})
  useEffect(() => {
    setDisplay(
      (chain && chain.id !== currentChain) || getChainIdFromName(currentChainInfo.internalName) === 0 ? '' : 'none'
    )
  }, [currentChain, chain, currentChainInfo])
  return (
    <div
      className="absolute z-[100] flex  w-full sm:w-fit  sm:right-10 justify-end bottom-10  mx-2 rounded-[10px] "
      style={{ display: display, marginLeft: 'auto', marginRight: 'auto' }}
    >
      <div className="bg-gray-800 mx-2 sm:mx-0 rounded-[10px]">
        <button
          onClick={() => {
            !isPending && !isSuccess && switchNetwork?.({ chainId: currentChain })
          }}
          className={`relative sm:mx-0 max-w-[340px] w-full sm:w-[347px] h-[94px] rounded-[10px] flex flex-row border-gray-600  border-[1px] hover:${!isPending && !isSuccess ? 'bg-hoverbackground' : ''}`}
        >
          <div className="h-full flex items-center p-4 ">
            <div className="w-6  h-6">
              {isSuccess ? (
                <img src={'https://assets.oku.trade/check.svg'} className="w-6 h-6"></img>
              ) : !isPending ? (
                <ExclamationTriangleIcon
                  className="w-6 h-6"
                  fill="#00000000"
                  stroke={isError ? colors.yellow[100] : colors.blue[400]}
                />
              ) : (
                <img src={'https://assets.oku.trade/loader.svg'} className="w-6 h-6  animate-spin"></img>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start h-full justify-center gap-2 text-left pr-12 ">
            <T1 color={'text-gray-100'}>
              {isSuccess ? 'Success switching networks' : isError ? 'Error switching networks' : 'Switch networks'}
            </T1>
            <T2 color={colors.gray[300]}>
              {isSuccess
                ? `Switched to ${currentChainInfo.name}`
                : `Switch to ${currentChainInfo.name} to continue trading on Oku`}
            </T2>
          </div>
        </button>
        <button
          onClick={() => setDisplay('none')}
          className="absolute right-5  sm:right-3 top-3 hover:stroke-gray-200 stroke-white"
        >
          <XMarkIcon className="w-4 h-4" stroke="inherit" />
        </button>
      </div>
    </div>
  )
}

export default SwitchNetworkBanner
