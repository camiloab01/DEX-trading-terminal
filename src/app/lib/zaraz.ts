import { identify, track } from '@multibase/js'

export const zarazTrack = (name: string, content: any) => {
  if (window.zaraz) {
    window.zaraz.track(name, content)
  }
  track(name, content)
  if (content?.address && name === 'wallet_connect') {
    identify({ address: content.address, properties: content })
  }
}
