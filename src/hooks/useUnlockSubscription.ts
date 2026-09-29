// ── VitalOS — Unlock Protocol subscription hook ───────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { base } from 'viem/chains'
import { getLockAddress, PUBLIC_LOCK_ABI, ERC20_APPROVE_ABI } from '@/lib/billing/unlock'
import type { Tier } from '@/lib/database.types'
import { useAuth } from '@/contexts/AuthContext'

type PurchaseState = 'idle' | 'checking' | 'approving' | 'purchasing' | 'confirming' | 'done' | 'error'

export interface UseUnlockSubscriptionReturn {
  hasKey:        boolean
  keyChecked:    boolean
  purchaseState: PurchaseState
  errorMsg:      string | null
  purchase:      () => Promise<void>
  recheck:       () => void
}

export function useUnlockSubscription(tier: Tier): UseUnlockSubscriptionReturn {
  const { address, chain }       = useAccount()
  const { data: walletClient }   = useWalletClient()
  const publicClient             = usePublicClient()
  const { refreshProfile }       = useAuth()
  const cancelRef                = useRef(false)

  const [hasKey,        setHasKey]        = useState(false)
  const [keyChecked,    setKeyChecked]    = useState(false)
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle')
  const [errorMsg,      setErrorMsg]      = useState<string | null>(null)
  const [recheckFlag,   setRecheckFlag]   = useState(0)

  const recheck = useCallback(() => setRecheckFlag(n => n + 1), [])

  const lockAddress = getLockAddress(tier)

  // ── Key check effect (reads from chain, never calls setState mid-render) ────
  useEffect(() => {
    cancelRef.current = false

    async function run() {
      if (!address || !lockAddress || !publicClient) {
        if (!cancelRef.current) {
          setHasKey(tier === 'node')
          setKeyChecked(true)
        }
        return
      }
      try {
        const result = await publicClient.readContract({
          address:      lockAddress,
          abi:          PUBLIC_LOCK_ABI,
          functionName: 'getHasValidKey',
          args:         [address],
        })
        if (!cancelRef.current) {
          setHasKey(result)
          setKeyChecked(true)
        }
      } catch {
        if (!cancelRef.current) {
          setHasKey(false)
          setKeyChecked(true)
        }
      }
    }

    void run()
    return () => { cancelRef.current = true }
  // recheckFlag intentionally triggers re-check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, lockAddress, publicClient, tier, recheckFlag])

  // ── Purchase flow ─────────────────────────────────────────────────────────
  const purchase = useCallback(async () => {
    if (!address || !lockAddress || !walletClient || !publicClient) {
      setErrorMsg('Connect a wallet first.')
      return
    }
    if (chain?.id !== base.id) {
      setErrorMsg('Switch to Base network to subscribe.')
      return
    }

    setErrorMsg(null)
    setPurchaseState('checking')

    try {
      const [rawPrice, rawToken] = await Promise.all([
        publicClient.readContract({ address: lockAddress, abi: PUBLIC_LOCK_ABI, functionName: 'keyPrice' }),
        publicClient.readContract({ address: lockAddress, abi: PUBLIC_LOCK_ABI, functionName: 'tokenAddress' }),
      ])

      const keyPrice  = rawPrice
      const tokenAddr = rawToken
      const isNative  = tokenAddr === '0x0000000000000000000000000000000000000000'

      if (!isNative) {
        const allowance = await publicClient.readContract({
          address:      tokenAddr,
          abi:          ERC20_APPROVE_ABI,
          functionName: 'allowance',
          args:         [address, lockAddress],
        })

        if (allowance < keyPrice) {
          setPurchaseState('approving')
          const approveTx = await walletClient.writeContract({
            address:      tokenAddr,
            abi:          ERC20_APPROVE_ABI,
            functionName: 'approve',
            args:         [lockAddress, keyPrice],
            account:      address,
          })
          setPurchaseState('confirming')
          await publicClient.waitForTransactionReceipt({ hash: approveTx })
        }
      }

      setPurchaseState('purchasing')
      const hash = await walletClient.writeContract({
        address:      lockAddress,
        abi:          PUBLIC_LOCK_ABI,
        functionName: 'purchase',
        args: [
          [isNative ? keyPrice : 0n],
          [address],
          ['0x0000000000000000000000000000000000000000'],
          ['0x0000000000000000000000000000000000000000'],
          ['0x'],
        ],
        account: address,
        value:   isNative ? keyPrice : 0n,
      })

      setPurchaseState('confirming')
      await publicClient.waitForTransactionReceipt({ hash })

      setPurchaseState('done')
      setHasKey(true)
      await refreshProfile()
      recheck()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      setErrorMsg(msg.includes('User rejected') || msg.includes('user rejected')
        ? 'Transaction cancelled.'
        : msg.slice(0, 120))
      setPurchaseState('error')
    }
  }, [address, chain, lockAddress, walletClient, publicClient, refreshProfile, recheck])

  return { hasKey, keyChecked, purchaseState, errorMsg, purchase, recheck }
}
