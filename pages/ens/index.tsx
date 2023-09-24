import { Button, Card, Input } from "@ensdomains/thorin"
import { ENS } from "@ensdomains/ensjs"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { fetchEnsName } from "@wagmi/core"

export default function ens() {
  const { address } = useAccount()
  const [ensName, setEnsName] = useState<string>()
  const [subname, setSubname] = useState<string>()

  useEffect(() => {
    getEnsName().then((ens: string | null) => {
      if (ens) {
        setEnsName(ens)
      }
    })
  })

  const getEnsName = async () => {
    return await fetchEnsName({
      address: address as `0x${string}`,
    })
  }

  const createSubdomain = async () => {
    const ens: ENS = new ENS()
    console.log(ens)
    // await ens.name(ensName).createSubdomain(subname)
  }

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
        <Button onClick={createSubdomain}>Create</Button>
      </Card>
    </div>
  )
}
