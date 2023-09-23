export interface TokenDistribution {
  token: string
  distribution: string
}

export interface Saving {
  id: string
  tokenDistribution: TokenDistribution[]
}
