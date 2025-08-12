export type Address = string | `0x${string}`
export type Hash = string | `0x${string}`

export interface TelemetryApi {
  marq_recordOkuTelemetry: (
    arg: [chain_id: number, current_page: string, feature: string, sender: Address, transaction: Hash, extra: any]
  ) => any
}
