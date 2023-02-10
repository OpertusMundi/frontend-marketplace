interface Match {
  keys: {
    from: string,
    to: string,
  },
  related: {
    coma: number,
  },
  explanation: string,
}

interface DiscoveryResult {
  joinableTables: {
    matches: Match[],
    tableName: string,
  }[],
}

// eslint-disable-next-line
export { DiscoveryResult };
