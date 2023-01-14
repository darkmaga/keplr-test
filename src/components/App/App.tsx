import { SigningCosmosClient } from '@cosmjs/launchpad'
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} from '@cosmjs/stargate'
import { ChangeEvent, useEffect, useState } from 'react'
import { CHAIN_ID } from '../../constants'
import useToast from '../../hooks/useToast'
import { configureSendingTokens } from '../../utils'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Toast from '../Toast/Toast'

import './App.css'

function App() {
  if (!window.keplr)
    return <ErrorBoundary message='Please install keplr extension' />

  const sendTokens = async ({ to, amount }: { to: string; amount: string }) => {
    const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)
    const accounts = await offlineSigner.getAccounts()

    await configureSendingTokens()

    const client = await SigningStargateClient.connectWithSigner(
      'https://rpc-osmosis.blockapsis.com',
      offlineSigner
    )

    const amountFinal = {
      denom: 'uosmo',
      amount,
    }

    const fee = {
      amount: [
        {
          denom: 'uosmo',
          amount: '5000',
        },
      ],
      gas: '200000',
    }

    try {
      const result = await client.sendTokens(
        accounts[0].address,
        to,
        [amountFinal],
        fee,
        ''
      )
      assertIsBroadcastTxSuccess(result)

      if (result.code !== 0 && result.code !== undefined) {
        setToast({ type: 'error', message: result.log || result.rawLog })
        return
      }

      setToast({ type: 'success', message: 'Tokens send' })
    } catch (e) {
      console.error(e)
      setToast({ type: 'error', message: 'Error while sending' })
    }
  }

  useEffect(() => {
    const getUserInfo = async () => {
      await window.keplr.enable(CHAIN_ID)

      const userInfo = await window.keplr.getKey(CHAIN_ID)

      if (!userInfo.name) return

      setUserInfo(userInfo.name)
    }

    getUserInfo()
  }, [])

  const [userInfo, setUserInfo] = useState<string>('')
  const [transactionDetails, setTransactionsDetails] = useState<{
    to: string
    amount: string
  }>()

  const { toast, setToast } = useToast()

  return (
    <main className='App'>
      <div className='layout-container'>
        <h2>
          Hello, <span className='text-purple'>{userInfo || 'stranger'}</span>
        </h2>
        <div className='container'>
          <p>Send Tokens</p>
          <div className='input-container'>
            <input
              type='text'
              placeholder='To'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTransactionsDetails((prev) => ({
                  ...prev,
                  to: e.target.value,
                }))
              }
            />
            <input
              type='text'
              placeholder='Amount'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTransactionsDetails((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
            />
          </div>
          <button
            onClick={() => {
              if (!(transactionDetails?.amount && transactionDetails.to)) return

              sendTokens(transactionDetails)
            }}
          >
            Send
          </button>
        </div>
        {toast && <Toast toast={toast} />}
      </div>
    </main>
  )
}

export default App
