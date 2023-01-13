import { SigningCosmosClient } from '@cosmjs/launchpad'
import { useEffect, useState } from 'react'

import './App.css'

function App() {
  useEffect(() => {
    const test = async () => {
      const chainId = 'cosmoshub-4'

      await window.keplr.enable(chainId)

      const offlineSigner = window.keplr.getOfflineSigner(chainId)

      // You can get the address/public keys by `getAccounts` method.
      // It can return the array of address/public key.
      // But, currently, Keplr extension manages only one address/public key pair.
      // XXX: This line is needed to set the sender address for SigningCosmosClient.
      const accounts = await offlineSigner.getAccounts()

      console.log(offlineSigner, accounts)

      const cosmJS = new SigningCosmosClient(
        'https://lcd-cosmoshub.keplr.app',
        accounts[0].address,
        offlineSigner
      )

      console.log(cosmJS)
    }

    test()
  }, [])

  const [count, setCount] = useState(0)

  return <div className='App'></div>
}

export default App
