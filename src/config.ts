import { http, createConfig } from 'wagmi'
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
} from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { registerChain } from './tracing'

/**
 * VitalOS production chain registry.
 *
 * RPC URLs are intentionally resolved from environment variables so provider
 * credentials are never committed to the repository. Public RPCs are used as
 * a fallback for initial connectivity; production should configure dedicated
 * RPC providers.
 */
export const vitalosChains = [mainnet, base, arbitrum, optimism, polygon] as const

const rpc = (envName: string, fallback: string) =>
  http((import.meta.env[envName] as string | undefined) || fallback)

for (const chain of vitalosChains) {
  registerChain(chain.id, chain.rpcUrls.default.http[0])
}

export const config = createConfig({
  chains: vitalosChains,
  connectors: [injected()],
  transports: {
    [mainnet.id]: rpc('VITE_RPC_ETHEREUM', mainnet.rpcUrls.default.http[0]),
    [base.id]: rpc('VITE_RPC_BASE', base.rpcUrls.default.http[0]),
    [arbitrum.id]: rpc('VITE_RPC_ARBITRUM', arbitrum.rpcUrls.default.http[0]),
    [optimism.id]: rpc('VITE_RPC_OPTIMISM', optimism.rpcUrls.default.http[0]),
    [polygon.id]: rpc('VITE_RPC_POLYGON', polygon.rpcUrls.default.http[0]),
  },
})
