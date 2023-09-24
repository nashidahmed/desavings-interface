import { Button, Card, Input } from "@ensdomains/thorin"
import { ENS } from "@ensdomains/ensjs"
import { useEffect, useState } from "react"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import { fetchEnsName } from "@wagmi/core"
import ensAbi from "../../public/abis/ENS.json"
import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { namehash } from "viem"

const registryAddress = "0x114D4603199df73e7D157787f8778E21fCd13066"

const ensQuery = `
  query($name: String) {
    domains(where: {name: $name}) {
      id
      name
      labelName
      labelhash
    }
  }
`

export default function ens() {
  const { address } = useAccount()
  const [ensName, setEnsName] = useState<string>()
  const [subname, setSubname] = useState<string>()
  const [resolver, setResolver] = useState<string>()

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_ENS_GRAPH_URL,
    cache: new InMemoryCache(),
  })

  useEffect(() => {
    getEnsName().then((ens: string | null) => {
      if (ens) {
        setEnsName(ens)
      }
    })
  }, [address])

  const getEnsName = async () => {
    return await fetchEnsName({
      address: address as `0x${string}`,
    })
  }

  // Create wagmi contract call
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: registryAddress,
    abi: ensAbi,
    functionName: "setSubnodeRecord",
    enabled: false,
    args: [
      namehash(ensName || ""),
      namehash(subname || ""),
      address,
      resolver,
      0,
    ],
  })
  const {
    error: createError,
    isError: isCreateError,
    data,
    write,
  } = useContractWrite(config)

  return (
    <div className="w-fit">
      <header className="mt-12 text-xl">
        Create and set ENS subdomain for better experience
      </header>
      <Card className="my-8">
        <Input
          label="Create a subdomain"
          placeholder="example"
          suffix={ensName ? `.${ensName}` : ""}
          onChange={(e) => setSubname(e.target.value)}
        />
        <Input
          label="Enter the subdomain record"
          placeholder="0xA0Cf…251e"
          onChange={(e) => setResolver(e.target.value)}
        />
        <Button onClick={() => write?.()}>Create</Button>
      </Card>
    </div>
  )
}
