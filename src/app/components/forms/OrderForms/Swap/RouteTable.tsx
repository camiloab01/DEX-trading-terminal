import { T1, T3 } from '../../../typography/Typography.tsx'
import { FontWeightEnums } from '../../../../types/Enums.ts'
import { colors } from '../../../../constants/colors.ts'
import React, { useMemo } from 'react'
import { PriceQuoteWithMarket } from '../../../../types/canoe'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { PriceFlipper } from './PriceFlipper.tsx'
import { formatNumber } from '../../../numbers/FormatNumber.tsx'
import { GasInfo } from './GasInfo.tsx'
import EngineName from './EngineName.ts'
import { SwapRoute } from '../../../../hooks/useSwapRouter.tsx'
import { useWindowSize } from 'usehooks-ts'
import { ReactSVG } from 'react-svg'
import { t } from '@lingui/macro'
import { TokenSymbol } from '../../../misc/TokenSymbol.tsx'

const Brain = 'https://assets.oku.trade/Icon/Brain.svg'
const TableTitle = ({ children }: { children: React.ReactNode }) => <T3 color={colors.gray[400]}>{children}</T3>
const TableCell = (props: {
  children?: React.ReactNode
  desktopClass?: string
  mobileClass?: string
  desktopRight?: boolean
  mobileRight?: boolean
  colSpan?: number
  minWidth?: string
}) => {
  const { children, desktopClass, mobileClass, desktopRight, mobileRight, colSpan, minWidth } = props
  const { width } = useWindowSize()
  const isDesktop = width >= 768
  return (
    <td
      className={`${minWidth} ${isDesktop ? `px-3 first:pl-2 last:pr-2 py-3 ${desktopClass}` : `${mobileClass}`}`}
      colSpan={colSpan}
    >
      <div className={`${isDesktop ? desktopRight && 'float-right' : mobileRight && 'float-right'}`}>{children}</div>
    </td>
  )
}

const EngineText = ({ engine }: { engine: string }) => {
  const windowSize = useWindowSize()
  const isDesktop = windowSize.width >= 768
  const weight = isDesktop ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR
  const bgImage = { backgroundImage: `url("https://assets.oku.trade/Router/${engine}.svg")` }
  return (
    <div className={'flex flex-row gap-1 items-center'}>
      {!isDesktop && (
        <T3 weight={weight} color={colors.gray[300]}>
          Via
        </T3>
      )}
      <div
        className={`bg-gray-750 border border-gray-600 rounded p-0.5 ${isDesktop ? `w-5 h-5` : `w-4 h-4`} bg-contain bg-no-repeat bg-center bg-origin-content`}
        style={bgImage}
      ></div>
      <T3 weight={weight} color={colors.gray[300]}>
        {EngineName(engine)}
      </T3>
    </div>
  )
}

const AmountText = ({ quote }: { quote?: PriceQuoteWithMarket }) => {
  const windowSize = useWindowSize()
  const isDesktop = windowSize.width >= 768

  if (!quote) return <></>
  const number = formatNumber({
    num: quote.isExactIn ? quote.outAmount : quote.inAmount,
    aboveOneDecimalAmount: 3,
  })

  return isDesktop ? (
    <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[50]}>
      {number}{' '}
      {quote.isExactIn ? (
        <TokenSymbol address={quote.outToken.address} fallback_name={quote.outToken.symbol} />
      ) : (
        <TokenSymbol address={quote.inToken.address} fallback_name={quote.inToken.symbol} />
      )}
    </T3>
  ) : (
    <T1 fontSize={{ base: '14px', sm: '14px' }} weight={FontWeightEnums.MEDIUM} color={colors.gray[50]}>
      {number}{' '}
      {quote.isExactIn ? (
        <TokenSymbol address={quote.outToken.address} fallback_name={quote.outToken.symbol} />
      ) : (
        <TokenSymbol address={quote.inToken.address} fallback_name={quote.inToken.symbol} />
      )}
    </T1>
  )
}

const QuoteDiff = ({ percent }: { percent: number }) => {
  const windowSize = useWindowSize()
  const isDesktop = windowSize.width >= 768
  const weight = isDesktop ? FontWeightEnums.REGULAR : FontWeightEnums.MEDIUM
  return (
    <div className={`${percent === 0 && isDesktop ? 'bg-green-700 w-min p-1 rounded' : ''}`}>
      <T3 weight={weight} color={percent === 0 ? colors.green[200] : colors.red[300]}>
        {percent === 0 ? '0.00%' : `${percent < 0 ? '+' : ''}${(-percent * 100).toFixed(2)}%`}
      </T3>
    </div>
  )
}

export const RouteTable = (props: {
  routes: SwapRoute[]
  setSelectedRoute: (route: PriceQuoteWithMarket | undefined) => void
  close?: () => void
}) => {
  const { routes, setSelectedRoute, close } = props
  const checkedMarkets = JSON.parse(window.localStorage.getItem('checkedMarkets') || '[]')
  const filteredRoutes = useMemo(() => routes.filter((route) => checkedMarkets.includes(route.market)), [routes])

  const ch = createColumnHelper<SwapRoute>()
  const columns = useMemo(
    () => [
      ch.accessor((route) => route.market, {
        id: 'market',
        header: () => <TableTitle>{t`Route`}</TableTitle>,
        cell: (cell) => (
          <TableCell mobileClass={'order-6'} mobileRight minWidth="md:min-w-[110px]">
            <EngineText engine={cell.getValue()} />
          </TableCell>
        ),
      }),
      ch.accessor((route) => route.quote, {
        id: 'amount',
        header: () => <TableTitle>{t`Amount`}</TableTitle>,
        cell: (cell) => {
          const quote = cell.getValue()
          return (
            <TableCell mobileClass={'order-0'} minWidth="md:min-w-[120px]">
              <AmountText quote={quote} />
            </TableCell>
          )
        },
      }),
      ch.accessor((route) => route.quote, {
        id: 'price',
        header: () => <TableTitle>{t`Price`}</TableTitle>,
        cell: (cell) => (
          <TableCell mobileClass={'order-5 grow'} minWidth="md:min-w-[200px]">
            <PriceFlipper route={cell.getValue()} color={colors.gray[300]} />
          </TableCell>
        ),
      }),
      ch.accessor((route) => (route.quote?.estimatedGas ? Number(route.quote.estimatedGas) : undefined), {
        id: 'gas',
        header: () => <TableTitle>{t`Gas`}</TableTitle>,
        cell: (cell) => (
          <TableCell mobileClass={'order-2'} minWidth="md:min-w-[100px]">
            <GasInfo color={colors.gray[300]} gas={cell.getValue()} />
          </TableCell>
        ),
      }),
      ch.accessor(
        (route) =>
          route.quote &&
          filteredRoutes[0].quote &&
          (route.quote.isExactIn
            ? (filteredRoutes[0].quote.outUsdValue / filteredRoutes[0].quote.inUsdValue -
                route.quote.outUsdValue / route.quote.inUsdValue) /
              (filteredRoutes[0].quote.outUsdValue / filteredRoutes[0].quote.inUsdValue)
            : (filteredRoutes[0].quote.inUsdValue - route.quote.inUsdValue) / filteredRoutes[0].quote.inUsdValue),
        {
          id: 'diff',
          header: () => <></>,
          cell: (cell) => (
            <TableCell mobileClass={'order-3 grow'} mobileRight desktopRight minWidth="md:min-w-[70px]">
              <QuoteDiff percent={cell.getValue() ?? 1} />
            </TableCell>
          ),
        }
      ),
    ],
    [filteredRoutes]
  )

  const table = useReactTable({
    data: filteredRoutes,
    columns: columns as any,
    getCoreRowModel: getCoreRowModel(),
  })

  const { width } = useWindowSize()
  const isDesktop = width >= 768
  const getMinWidth = () => {
    if (width >= 320 && width < 640) return width - 12
    else if (width >= 640 && width < 768) return width - 48
    else if (width >= 768) return '540px'
    else return '100%'
  }
  const minWidth = { minWidth: getMinWidth() }
  return (
    <div
      className={`flex flex-col flex-1 grow rounded-xl bg-gray-900 border border-gray-800 overflow-hidden`}
      style={minWidth}
    >
      <div className={'p-4 flex items-center gap-2'}>
        <ReactSVG src={Brain} />
        <T1 weight={FontWeightEnums.SEMIBOLD}>{t`Oku Smart Router`}</T1>
      </div>
      <table className="table-auto grow">
        {isDesktop && (
          <thead className="bg-gray-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} className={'px-3 first:pl-2 last:pr-2 py-2 text-left'}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody>
          {table.getRowModel().rows.map((row) => {
            if (!row.original.loading && row.original.quote === undefined) return <React.Fragment key={row.id} />
            return (
              <tr
                key={row.id}
                className={`${isDesktop ? `even:bg-gray-dark` : `odd:bg-gray-dark flex flex-wrap px-4 py-2 items-center min-h-[60px]`} border-t border-gray-800 
                ${!row.original.loading && `hover:bg-gray-750 cursor-pointer`}`}
                onClick={() => {
                  if (row.original.quote === undefined) return
                  setSelectedRoute(row.original.quote)
                  close?.()
                }}
              >
                {row.original.quote === undefined ? (
                  <>
                    <TableCell mobileClass={'order-2 basis-full'} mobileRight>
                      <EngineText engine={row.original.market} />
                    </TableCell>
                    <TableCell
                      colSpan={row.getVisibleCells().length - (isDesktop ? 1 : 0)}
                      mobileClass={'basis-full order-0'}
                    >
                      <div className={'w-full h-5 rounded-full animate-pulse bg-[#121621]'} />
                    </TableCell>
                    {!isDesktop && (
                      <>
                        <td className={'h-1 basis-full order-1'} colSpan={0} />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {row.getVisibleCells().map((cell) => (
                      <React.Fragment key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </React.Fragment>
                    ))}
                    {!isDesktop && (
                      <>
                        <td className={'w-2 order-1'} colSpan={0} />
                        <td className={'h-1 basis-full order-4'} colSpan={0} />
                      </>
                    )}
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
