import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Button, OutlinkSVG } from "@ensdomains/thorin"
import Link from "next/link"

export default function Home() {
  return (
    <div className="text-center mt-24 text-5xl font-mono">
      Welcome to DeSavings
      <div className="text-3xl font-mono my-24">
        Create an automated savings plan today
      </div>
      <Link href={"/create"} className="flex justify-center gap-2 text-xl">
        Click here to get started <OutlinkSVG />
      </Link>
    </div>
  )
}
