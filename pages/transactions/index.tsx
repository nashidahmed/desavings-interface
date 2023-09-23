import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { Card } from "@ensdomains/thorin"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

const savingsQuery = `
  query($creator: String) {
    savings(where: { creator: $creator }) {
      id
      tokenDistribution {
        token
        distribution
      }
    }
  }
`

export default function Transactions() {
  const { address } = useAccount()
  const [savings, setSavings] = useState([
    {
      __typename: "Saving",
      id: "0x5a1c568ff14efcd2b67471f5c8d87f4cdeafcdff",
      tokenDistribution: [
        {
          __typename: "TokenDistribution",
          token: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
          distribution: 20,
        },
        {
          __typename: "TokenDistribution",
          token: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
          distribution: 80,
        },
      ],
    },
  ])

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPH_URL,
    cache: new InMemoryCache(),
  })

  // useEffect(() => {
  //   client
  //     .query({
  //       query: gql(savingsQuery),
  //       variables: {
  //         creator: address,
  //       },
  //     })
  //     .then((data) => {
  //       console.log(data.data.savings)

  //       setSavings(data.data.savings)
  //     })
  //     .catch((err) => {
  //       console.log("Error fetching data: ", err)
  //     })
  // }, [address])

  return (
    <>
      <header className="mt-12 text-xl">
        View transactions from your savings plan
      </header>
      <Card className="my-8"></Card>
    </>
  )
}
