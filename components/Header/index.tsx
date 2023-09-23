import Link from "next/link"

export default function Header() {
  return (
    <div className="py-8 flex justify-between">
      <div className="font-mono text-3xl">DeSavings</div>
      <div className="flex gap-4 items-center">
        <Link href={"/create"}>Create Plan</Link>
        <Link href={"/transactions"}>Transactions</Link>
        <w3m-button />
      </div>
    </div>
  )
}
