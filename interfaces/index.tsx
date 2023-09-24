export interface TokenDistribution {
  token: string
  distribution: string
}

export interface Saving {
  id: string
  tokenDistribution: TokenDistribution[]
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  tokenIn: string
  amountIn: string
  outgoingTokens: OutgoingToken[]
}

export interface OutgoingToken {
  token: string
  amount: string
}
