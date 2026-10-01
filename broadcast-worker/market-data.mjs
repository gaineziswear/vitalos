const DEFAULT_SNAPSHOT = {
  marketStatus: 'Live market feed not configured',
  opportunityStatus: 'Live opportunity feed not configured',
  timestamp: null,
  source: null,
}

export async function fetchMarketSnapshot() {
  const url = process.env.VITALOS_MARKET_DATA_URL
  if (!url) return DEFAULT_SNAPSHOT

  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`market feed returned ${response.status}`)
    const data = await response.json()
    return {
      marketStatus: String(data.marketStatus ?? data.status ?? 'Data received'),
      opportunityStatus: String(data.opportunityStatus ?? 'Research feed connected'),
      timestamp: data.timestamp ? String(data.timestamp) : new Date().toISOString(),
      source: String(data.source ?? url),
    }
  } catch (error) {
    return {
      ...DEFAULT_SNAPSHOT,
      marketStatus: 'Live market feed temporarily unavailable',
      opportunityStatus: 'Opportunity feed temporarily unavailable',
      timestamp: new Date().toISOString(),
      source: 'VITALOS feed error',
      error: error instanceof Error ? error.message : 'unknown feed error',
    }
  }
}
