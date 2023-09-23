import {
  Button,
  Card,
  CrossCircleSVG,
  Field,
  Input,
  Select,
} from "@ensdomains/thorin"
import { useState } from "react"

interface TokenDistribution {
  token: string
  distribution: string
}

const incomingTokens = [
  { value: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", label: "UNI" },
  { value: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", label: "USDC" },
]

export default function create() {
  const newTokenDistribution = { token: "", distribution: "" }

  const [whitelistToken, setWhitelistToken] = useState<string>()
  const [tokenDistribution, setTokenDistribution] = useState<
    TokenDistribution[]
  >([newTokenDistribution])

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
      <header className="mt-12 mb-8 text-xl">
        Create your automated savings plan
      </header>
      <Card>
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
                  <div className="flex gap-4 item" key={index}>
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
          <Button
            width="fit"
            className="mt-4"
            onClick={() =>
              setTokenDistribution([...tokenDistribution, newTokenDistribution])
            }
          >
            Add new token
          </Button>
        </div>
      </Card>
    </>
  )
}
