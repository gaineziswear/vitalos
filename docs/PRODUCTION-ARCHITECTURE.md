# VitalOS production architecture

## Objective

Move VitalOS from the Arc Studio/Hugging Face prototype architecture toward an independent, non-custodial Web3 application.

## Deployment

- Frontend/static assets: Cloudflare Workers Static Assets
- DNS/WAF/CDN: Cloudflare
- Authentication/database: Supabase
- Edge/API layer: Cloudflare Workers
- Blockchain access: multi-provider RPC layer
- Market/yield data: server-side aggregation, initially including DeFiLlama
- Wallet: Wagmi/Viem + ConnectKit
- Contracts: Foundry/OpenZeppelin, deployed only after simulation and security review

The repository includes wrangler.jsonc for the first Cloudflare deployment. The SPA fallback is enabled so React client-side routes work on direct navigation.

## Production boundaries

The browser must not be the source of truth for portfolio balances, risk calculations, opportunity normalization, or security assessments.

Target flow:

Browser -> VitalOS API -> data providers/RPC -> normalized data -> risk/yield engines -> simulation -> user wallet signature -> chain.

## Wallet policy

VitalOS is non-custodial. A connected wallet is an authorization/signing surface, not a credential that VitalOS should custody.

Before enabling real execution:
1. Read the connected address and chain from Wagmi.
2. Fetch balances and positions from trusted providers.
3. Build a deterministic transaction preview.
4. Simulate the transaction.
5. Display contract, chain, token, amount, slippage, gas and recipient.
6. Require explicit wallet signature.
7. Verify the resulting transaction on-chain.
8. Record an auditable execution receipt.

No private key or seed phrase belongs in VitalOS.

## Chain strategy

VitalOS should use a configurable chain registry rather than hard-coding a single ecosystem.

Initial production targets should be Ethereum, Base, Arbitrum, Optimism and Polygon, with additional chains added after data coverage and risk methodology are validated. Arc can remain an experimental/partner network rather than the architectural dependency.

Each chain definition should provide:
- chain ID
- RPC endpoint configuration
- explorer
- native asset
- stablecoins
- supported protocols
- indexing/data providers
- execution support status
- risk coverage status

## Risk engine

The current UI/type model is retained, but production calculations must replace placeholder assumptions.

Every calculated metric should carry:
- source
- retrieval timestamp
- methodology/version
- confidence
- assumptions
- raw inputs where practical

Risk dimensions include smart contract, liquidity, market, stablecoin, oracle, governance and bridge risk.

## Yield engine

Gross APY/APR must never be presented as sustainable yield without decomposition.

Target calculation:

gross yield
- incentive dependency
- protocol fees
- borrowing costs
- gas
- expected slippage
- exit costs
- liquidity constraints
= estimated net/sustainable yield

The UI should distinguish live provider data, derived calculations and demo/fallback data.

## Yield Guard

Yield Guard should become a server-side monitoring system:

scheduled jobs -> provider/RPC refresh -> anomaly/risk detection -> exposure lookup -> notification.

It should not claim continuous monitoring until this backend exists.

## Rebrand

The public product name is VitalOS. Domain/product branding must use VitalOS.

Legacy YIELDOS references should be removed where they refer to the former product name. Domain concepts such as "Yield DNA" remain valid and should not be renamed.

## Current alpha limitations

The current application contains prototype/demo pathways, including a simulated wallet address and fallback/demo opportunity data. These must not be represented as production execution or live portfolio truth.

## Launch gates

VitalOS should not enable real capital execution until:
- real wallet connection is verified
- supported chains are explicit
- live portfolio indexing is reliable
- transaction simulation is implemented
- risk methodology is versioned
- security controls are tested
- contracts are independently reviewed/audited where applicable
- monitoring and rollback procedures exist
- legal/regulatory review is completed for the intended jurisdictions and product functions
