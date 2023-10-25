import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { Card, RecordItem, RightArrowSVG } from "@ensdomains/thorin"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Saving, TokenDistribution, Transaction } from "../../interfaces"
import { formatUnits } from "ethers"

const savingsQuery = `
  query($creator: String) {
    savings(where: { creator: $creator }) {
      id
      tokenDistribution {
        token
        distribution
      }
      transactions {
        tokenIn,
        amountIn
        outgoingTokens {
          token
          amount
        }
      }
    }
  }
`

const tokens: any = {
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": {
    name: "UNI",
    decimals: 18,
  },
  "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6": {
    name: "ETH",
    decimals: 18,
  },
  "0x326c977e6efc84e512bb9c30f76e30c160ed06fb": {
    name: "LINK",
    decimals: 18,
  },
  "0x07865c6e87b9f70255377e024ace6630c1eaa37f": {
    name: "USDC",
    decimals: 6,
  },
  "0x0000000000000000000000000000000000000000": {
    name: "ETH",
    decimals: 18,
  },
}

export default function Transactions() {
  const { address } = useAccount()
  const [savings, setSavings] = useState<Saving[]>([])

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPH_URL,
    cache: new InMemoryCache(),
  })

  useEffect(() => {
    client
      .query({
        query: gql(savingsQuery),
        variables: {
          creator: address,
        },
      })
      .then((data) => {
        console.log(data.data.savings)

        setSavings(data.data.savings)
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
  }, [address])

  return (
    <>
      <header className="mt-12 text-xl">
        View transactions from your savings plan
      </header>
      <div className="grid gap-4 grid-cols-2 mt-8 mb-24">
        {savings && savings.length ? (
          savings.map((saving) => (
            <Card key={saving.id}>
              <div className="w-fit">
                <RecordItem
                  keyLabel="Savings"
                  keySublabel="Address"
                  value={saving.id}
                >
                  {saving.id}
                </RecordItem>
                <div className="my-4">
                  <div className="mb-4">Token distribution</div>
                  {saving.tokenDistribution.map((td: TokenDistribution) => (
                    <div key={td.token} className="flex gap-8 font-mono my-2">
                      {tokens[td.token]?.name} <RightArrowSVG />{" "}
                      {td.distribution}%
                    </div>
                  ))}
                </div>
                <div className="my-4">
                  <div className="mb-4 font-bold">Transactions</div>
                  {saving.transactions.map((transaction: Transaction) => (
                    <div
                      key={transaction.id}
                      className="flex gap-8 font-mono my-2"
                    >
                      {`${formatUnits(
                        transaction.amountIn,
                        tokens[transaction.tokenIn]?.decimals
                      )}`}{" "}
                      {tokens[transaction.tokenIn]?.name}
                      <RightArrowSVG />
                      <div>
                        {transaction.outgoingTokens.map((amount) => (
                          <div key={amount.token}>
                            {`${formatUnits(
                              amount.amount,
                              tokens[amount.token]?.decimals
                            )}`}{" "}
                            {tokens[amount.token]?.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-lg mt-24">No contracts to show</div>
        )}
      </div>
    </>
  )
}
