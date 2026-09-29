// ── VitalOS — Unlock Protocol integration ────────────────────────────────────
// Non-custodial onchain subscriptions via Unlock Protocol PublicLock NFT keys.
// Users purchase a "key" (ERC-721) which grants tier access for the duration.
// Lock addresses below are placeholders — replace with YOUR deployed lock
// addresses from app.unlock-protocol.com after creating locks for each tier.

import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { base } from 'viem/chains'
import type { Tier } from '@/lib/database.types'

// ── Unlock factory addresses (verified from docs.unlock-protocol.com) ────────
export const UNLOCK_FACTORIES = {
  base:     '0xd0b14797b9D08493392865647384974470202A78' as `0x${string}`,
  polygon:  '0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f' as `0x${string}`,
  ethereum: '0xe79B93f8E22676774F2A8dAd469175ebd00029FA' as `0x${string}`,
} as const

// ── Supported payment token on Base (USDC) ───────────────────────────────────
export const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`

// ── Lock addresses — SET THESE after deploying locks at app.unlock-protocol.com
// Each tier maps to one lock per chain. Currently using Base as primary chain.
// IMPORTANT: these are placeholder addresses — replace before going live.
export const LOCK_ADDRESSES: Record<Tier, `0x${string}` | null> = {
  node:      null,                                                     // free tier — no lock
  validator: (import.meta.env.VITE_LOCK_VALIDATOR as `0x${string}`) ?? null,
  staker:    (import.meta.env.VITE_LOCK_STAKER    as `0x${string}`) ?? null,
  architect: (import.meta.env.VITE_LOCK_ARCHITECT as `0x${string}`) ?? null,
  protocol:  (import.meta.env.VITE_LOCK_PROTOCOL  as `0x${string}`) ?? null,
}

// ── PublicLock ABI (minimal — purchase + hasValidKey) ────────────────────────
export const PUBLIC_LOCK_ABI = [
  {
    name: 'purchase',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: '_values',      type: 'uint256[]' },
      { name: '_recipients',  type: 'address[]' },
      { name: '_referrers',   type: 'address[]' },
      { name: '_keyManagers', type: 'address[]' },
      { name: '_data',        type: 'bytes[]'   },
    ],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'getHasValidKey',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: '_user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'keyPrice',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'expirationDuration',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenAddress',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

// ── ERC-20 approve ABI (for USDC approval before purchase) ───────────────────
export const ERC20_APPROVE_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount',  type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner',   type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// ── Typed accessor (avoids unsafe-member-access lint on Record index) ────────
export function getLockAddress(tier: Tier): `0x${string}` | null {
  const addresses: Record<Tier, `0x${string}` | null> = LOCK_ADDRESSES
  const addr = Object.prototype.hasOwnProperty.call(addresses, tier)
    ? addresses[tier]
    : null
  return addr ?? null
}

// ── Check if a wallet holds a valid key for a tier ───────────────────────────
export async function hasValidKey(
  tier: Tier,
  walletAddress: `0x${string}`,
): Promise<boolean> {
  const lockAddress = getLockAddress(tier)
  if (!lockAddress) return tier === 'node' // node is always valid

  try {
    const client = createPublicClient({ chain: base, transport: http() })
    const result = await client.readContract({
      address:      lockAddress,
      abi:          PUBLIC_LOCK_ABI,
      functionName: 'getHasValidKey',
      args:         [walletAddress],
    })
    return result
  } catch {
    return false
  }
}

// ── Get lock price ────────────────────────────────────────────────────────────
export async function getLockPrice(tier: Tier): Promise<bigint> {
  const lockAddress = getLockAddress(tier)
  if (!lockAddress) return 0n

  try {
    const client = createPublicClient({ chain: base, transport: http() })
    const price = await client.readContract({
      address:      lockAddress,
      abi:          PUBLIC_LOCK_ABI,
      functionName: 'keyPrice',
    })
    return price
  } catch {
    return 0n
  }
}

// ── Purchase a key for a tier ─────────────────────────────────────────────────
// Returns the transaction hash. The caller is responsible for confirmation UX.
export async function purchaseKey(
  tier: Tier,
  walletAddress: `0x${string}`,
): Promise<`0x${string}`> {
  const lockAddress = getLockAddress(tier)
  if (!lockAddress) throw new Error(`No lock configured for tier: ${tier}`)

  if (!window.ethereum) throw new Error('No wallet detected')

  const walletClient = createWalletClient({
    chain:     base,
    transport: custom(window.ethereum),
  })

  const publicClient = createPublicClient({ chain: base, transport: http() })

  // Get price + payment token
  const [price, tokenAddr] = await Promise.all([
    publicClient.readContract({ address: lockAddress, abi: PUBLIC_LOCK_ABI, functionName: 'keyPrice' }),
    publicClient.readContract({ address: lockAddress, abi: PUBLIC_LOCK_ABI, functionName: 'tokenAddress' }),
  ])

  const keyPrice   = price
  const tokenAddress = tokenAddr
  const isNative   = tokenAddress === '0x0000000000000000000000000000000000000000'

  // If ERC-20 payment: check + request approval first
  if (!isNative) {
    const allowance = await publicClient.readContract({
      address:      tokenAddress,
      abi:          ERC20_APPROVE_ABI,
      functionName: 'allowance',
      args:         [walletAddress, lockAddress],
    })

    if (allowance < keyPrice) {
      await walletClient.writeContract({
        address:      tokenAddress,
        abi:          ERC20_APPROVE_ABI,
        functionName: 'approve',
        args:         [lockAddress, keyPrice],
        account:      walletAddress,
      })
    }
  }

  // Purchase the key
  const hash = await walletClient.writeContract({
    address:      lockAddress,
    abi:          PUBLIC_LOCK_ABI,
    functionName: 'purchase',
    args: [
      [keyPrice],
      [walletAddress],
      ['0x0000000000000000000000000000000000000000'],
      ['0x0000000000000000000000000000000000000000'],
      ['0x'],
    ],
    value:   isNative ? keyPrice : 0n,
    account: walletAddress,
  })

  return hash
}

// ── Tier pricing display (monthly equivalent) ────────────────────────────────
export const UNLOCK_TIER_PRICES: Record<Tier, string> = {
  node:      'Free',
  validator: '9 USDC / month',
  staker:    '29 USDC / month',
  architect: '99 USDC / month',
  protocol:  'Custom',
}

// ── Link to create a new lock on Unlock dashboard ────────────────────────────
export const UNLOCK_DASHBOARD_URL = 'https://app.unlock-protocol.com/locks/create'

export { base }
export type { Tier }
