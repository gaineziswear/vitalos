// ── VitalOS — useOpportunities hook ──────────────────────────────────────────
// Fetches live opportunity data from DeFiLlama.
// Returns clearly labelled LIVE data; falls back to DEMO data on error.

import { useReducer, useEffect, useCallback, useRef } from 'react'
import type { Opportunity } from '../types/yieldos'
import { fetchPools, freshnessLabel, type PoolsResult } from '../lib/providers/defillama'
import { DEMO_OPPORTUNITIES } from '../lib/demo-data'

export type DataMode = 'live' | 'demo' | 'loading' | 'error'

export interface OpportunitiesState {
  opportunities:  Opportunity[]
  dataMode:       DataMode
  fetchedAt:      number | null
  freshnessLabel: string
  count:          number
  error:          string | null
  refetch:        () => void
}

export interface FilterOptions {
  chains?:     string[]
  assets?:     string[]
  minTvl?:     number
  minApy?:     number
  stablecoin?: boolean
  limit?:      number
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type State = {
  result:   PoolsResult | null
  dataMode: DataMode
  error:    string | null
}

type Action =
  | { type: 'LOADING' }
  | { type: 'LIVE';  result: PoolsResult }
  | { type: 'DEMO' }
  | { type: 'ERROR'; error: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADING': return { ...state, dataMode: 'loading', error: null }
    case 'LIVE':    return { result: action.result, dataMode: 'live',  error: null }
    case 'DEMO':    return { result: null,           dataMode: 'demo',  error: null }
    case 'ERROR':   return { ...state,               dataMode: 'error', error: action.error }
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useOpportunities(filters: FilterOptions = {}): OpportunitiesState {
  const [{ result, dataMode, error }, dispatch] = useReducer(reducer, {
    result:   null,
    dataMode: 'loading',
    error:    null,
  })

  const fetchRef = useRef(0)
  const minTvl    = filters.minTvl    ?? 0
  const minApy    = filters.minApy    ?? 0
  const limit     = filters.limit     ?? 100
  const stablecoin = filters.stablecoin ?? false

  const load = useCallback((): void => {
    const id = ++fetchRef.current
    dispatch({ type: 'LOADING' })

    fetchPools({ minTvl, minApy, limit, stablecoin })
      .then((res: PoolsResult) => {
        if (id !== fetchRef.current) return
        if (res.stale || res.count === 0) {
          dispatch({ type: 'DEMO' })
        } else {
          dispatch({ type: 'LIVE', result: res })
        }
      })
      .catch((e: unknown) => {
        if (id !== fetchRef.current) return
        dispatch({ type: 'ERROR', error: e instanceof Error ? e.message : 'Unknown error' })
      })
  }, [minTvl, minApy, limit, stablecoin])

  // Sync with the external DeFiLlama API on mount and filter changes
  useEffect(() => { load() }, [load])

  const opportunities: Opportunity[] = dataMode === 'live' && result
    ? result.opportunities
    : DEMO_OPPORTUNITIES

  const fetchedAt = result?.fetchedAt ?? null

  return {
    opportunities,
    dataMode,
    fetchedAt,
    freshnessLabel: fetchedAt ? freshnessLabel(fetchedAt) : '',
    count:          opportunities.length,
    error,
    refetch:        load,
  }
}
