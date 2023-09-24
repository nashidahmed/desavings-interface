import { OutlinkSVG, RecordItem } from "@ensdomains/thorin"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchEnsName } from "@wagmi/core"
import { useAccount } from "wagmi"

export default function Header() {
  const { address } = useAccount()
  const [ensName, setEnsName] = useState<string>()

  useEffect(() => {
    getEnsName().then((ens: string | null) => {
      if (ens) {
        setEnsName(ens)
      }
    })
  }, [address])

  const getEnsName = async () => {
    if (address) {
      return await fetchEnsName({
        address: address as `0x${string}`,
      })
    } else {
      return ""
    }
  }

  return (
    <div className="py-8 flex justify-between">
      <div className="font-mono text-3xl">
        <Link href={"/"}>DeSavings</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href={"/create"}>Create Plan</Link>
        <Link href={"/transactions"}>Transactions</Link>
        <Link
          className="flex gap-2"
          href={`https://app.ens.domains/${ensName || ""}?tab=subnames`}
          target="_blank"
        >
          Set ENS <OutlinkSVG />
        </Link>

        <w3m-button />
      </div>
    </div>
  )
}
