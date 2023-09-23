import ethers, { parseEther } from "ethers"
import {
  Button,
  Card,
  CrossCircleSVG,
  Field,
  Input,
  Select,
} from "@ensdomains/thorin"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import IERC20 from "../../public/abis/IERC20.json"

interface TokenDistribution {
  token: string
  distribution: string
}

const incomingTokens = [
  { value: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", label: "UNI" },
  { value: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", label: "USDC" },
]

const LINK = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
const savingsFactory = "0x94De9e2f793Dde63718C28Dfa2333A8dF41Bce7e"

export default function create() {
  const newTokenDistribution = { token: "", distribution: "" }

  const [whitelistToken, setWhitelistToken] = useState<string>()
  const [tokenDistribution, setTokenDistribution] = useState<
    TokenDistribution[]
  >([newTokenDistribution])
  const [amount, setAmount] = useState<string>("")

  const {
    config: approveConfig,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: LINK,
    abi: IERC20,
    functionName: "approve",
    args: [savingsFactory, parseEther(amount || "0")],
  })

  const { error, isError, write: approve } = useContractWrite(approveConfig)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const td = [...tokenDistribution]
    const name = event.target.name
    if (name == "token") {
      td[index] = {
        token: event.target.value,
        distribution: td[index].distribution ?? "",
      }
    } else {
      td[index] = {
        token: td[index].token ?? "",
        distribution: event.target.value,
      }
    }
    setTokenDistribution(td)
  }

  return (
    <>
      <header className="mt-12 text-xl">
        Create your automated savings plan
      </header>
      <Card className="my-8">
        <Select
          autocomplete
          description="Select incoming tokens to trigger your Savings contract (ETH is by default an accepted incoming token)"
          label="Whitelisted incoming tokens"
          options={incomingTokens}
          onChange={(e) => setWhitelistToken(e.target.value)}
          placeholder="Select tokens..."
        />

        <div className="my-6">
          <Field
            description="Set your preferred tokens in savings along with their distributions"
            label="Choose token distributions"
            labelSecondary="Token split"
          >
            <>
              {tokenDistribution &&
                tokenDistribution.map((td, index) => (
                  <div className="flex gap-4 items-center" key={index}>
                    <div className="grow">
                      <Select
                        autocomplete
                        label=""
                        name="token"
                        options={incomingTokens}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Select token..."
                      />
                    </div>
                    <div className="flex w-24">
                      <Input
                        label=""
                        className="w-2"
                        name="distribution"
                        onChange={(e) => handleChange(e, index)}
                        placeholder="%"
                      />
                    </div>
                    <div className="flex w-fit">
                      <CrossCircleSVG
                        onClick={() =>
                          setTokenDistribution([
                            ...tokenDistribution.slice(0, index),
                            ...tokenDistribution.slice(index + 1),
                          ])
                        }
                        className="cursor-pointer hover:"
                      />
                    </div>
                  </div>
                ))}
            </>
          </Field>
          <div className="flex justify-center">
            <Button
              width="fit"
              className="mt-4"
              colorStyle="accentSecondary"
              onClick={() =>
                setTokenDistribution([
                  ...tokenDistribution,
                  newTokenDistribution,
                ])
              }
            >
              Add new token
            </Button>
          </div>
        </div>
        <div className="my-2">
          <Input
            label="LINK Amount"
            labelSecondary="Minimum amount: ~3 LINK"
            description="Enter the amount of LINK to pay for your automated transactions (1 LINK should last for about a 100 transactions)"
            className="w-2"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter LINK amount..."
          />
        </div>

        <div className="flex flex-col items-center mt-4 gap-2">
          <Button
            width="fit"
            onClick={approve}
            disabled={isPrepareError || isError}
          >
            Approve LINK
          </Button>
          {(isPrepareError || isError) && (
            <div className="text-center text-red-500">
              Error: {(prepareError || error)?.message}
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
