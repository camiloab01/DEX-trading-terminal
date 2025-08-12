import { CushApi } from '@gfxlabs/oku'
import { UseQueryOptions, UseQueryResult, keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRpcContext } from '../context/RpcContext'
import { useRpcBlockContext } from '../context/RpcBlockContext'
import { useEffect, useState } from 'react'
import { useChainLoader } from '../route/loaderData'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
export type ReturnTypeOfMethod<T> = T extends (...args: Array<any>) => any ? ReturnType<T> : any
export type ReturnTypeOfMethodIfExists<T, S> = S extends keyof T ? ReturnTypeOfMethod<T[S]> : any
export type MethodParams<T> = T extends (...args: infer P) => any ? P[0] : T
export type MethodParamsIfExists<T, S> = S extends keyof T ? MethodParams<T[S]> : S
export function useCurrentClient<
  K extends keyof CushApi,
  TData = ReturnTypeOfMethodIfExists<CushApi, K>,
  TMutated = TData,
  TError = unknown,
>(
  method: K | [K, (data?: TData) => TMutated],
  args: MethodParamsIfExists<CushApi, K>,
  options: Optional<UseQueryOptions<TData, TError, TData>, 'queryKey'> = { placeholderData: keepPreviousData }
): UseQueryResult<TData, TError> & { mutatedData: TMutated } {
  const { chain } = useChainLoader()
  return useClientForChain(chain, method, args, options)
}

export function useClientForChain<
  K extends keyof CushApi,
  TData = ReturnTypeOfMethodIfExists<CushApi, K>,
  TMutated = TData,
  TError = unknown,
>(
  chain: string,
  method: K | [K, (data?: TData) => TMutated],
  args: MethodParamsIfExists<CushApi, K>,
  options: Optional<UseQueryOptions<TData, TError, TData>, 'queryKey'> = { placeholderData: keepPreviousData }
): UseQueryResult<TData, TError> & { mutatedData: TMutated } {
  const { omniCush } = useRpcContext()
  const { blockNumber } = useRpcBlockContext()
  if (options != undefined) {
    if (options.placeholderData === undefined) {
      options.placeholderData = keepPreviousData
    }
  }
  const queryKey = [chain, method, blockNumber, args] as any[]
  if (options.queryKey) {
    queryKey.push(options.queryKey)
  }
  const copied: Omit<UseQueryOptions<TData, TError, TData>, 'initialData'> = {
    ...options,
    queryKey: queryKey,
  }
  copied.queryKey = queryKey
  copied.queryFn = async () => {
    if (typeof method === 'string') {
      return omniCush.network(chain).call(method, args)
    } else {
      return omniCush.network(chain).call(method[0], args)
    }
  }
  // 30 seconds cache
  if (copied.gcTime == undefined) {
    copied.gcTime = 30 * 1000
  }
  const resp = useQuery(copied)
  useEffect(() => {
    resp.refetch()
  }, [omniCush])

  const mutator =
    typeof method !== 'string'
      ? method[1]
      : (x: any) => {
          return x
        }
  const [mutatedData, setMutatedData] = useState<TMutated>(mutator(resp.data))
  useEffect(() => {
    setMutatedData(mutator(resp.data))
  }, [resp.data])
  const r: UseQueryResult<TData, TError> & { mutatedData: TMutated } = resp as any
  r.mutatedData = mutatedData
  return r
}
