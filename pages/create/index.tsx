import ethers, { BigNumberish, formatEther, parseEther } from "ethers"
import {
  Button,
  Card,
  CrossCircleSVG,
  Field,
  Input,
  PlusSVG,
  Select,
  Spinner,
} from "@ensdomains/thorin"
import { useEffect, useState } from "react"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { readContract } from "@wagmi/core"
import IERC20 from "../../public/abis/IERC20.json"
import savingsFactoryAbi from "../../public/abis/SavingsFactory.json"
import { TokenDistribution } from "../../interfaces"

const incomingTokens = [
  { value: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", label: "UNI" },
  { value: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", label: "USDC" },
  { value: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", label: "LINK" },
]

const LINK = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
const savingsFactory = "0x2d91cE9E8D2Cc683b9Cb7ac59a6A688FEB8D66B9"

export default function create() {
  const newTokenDistribution = { token: "", distribution: "" }

  const { address } = useAccount()
  const [allowance, setAllowance] = useState<string>()
  const [whitelistTokens, setWhitelistTokens] = useState<string[]>([
    "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  ])
  const [tokenDistribution, setTokenDistribution] = useState<
    TokenDistribution[]
  >([newTokenDistribution])
  const [amount, setAmount] = useState<string>("")

  useEffect(() => {
    getAllowance()
  }, [address])

  const getAllowance = async () => {
    if (address) {
      const allowance = (await readContract({
        address: LINK,
        abi: IERC20,
        functionName: "allowance",
        args: [address, savingsFactory],
      })) as BigNumberish
      setAllowance(formatEther(allowance))
    }
  }

  // Approve wagmi contract call
  const {
    config: approveConfig,
    error: approvePrepareError,
    isError: isApprovePrepareError,
  } = usePrepareContractWrite({
    address: LINK,
    abi: IERC20,
    functionName: "approve",
    args: [savingsFactory || "", parseEther(amount || "0")],
  })

  const {
    error: approveError,
    isError: isApproveError,
    data: approveData,
    write: approve,
  } = useContractWrite(approveConfig)

  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } =
    useWaitForTransaction({
      hash: approveData?.hash,
    })

  // Create wagmi contract call
  const {
    config: createConfig,
    error: createPrepareError,
    isError: isCreatePrepareError,
  } = usePrepareContractWrite({
    address: savingsFactory,
    abi: savingsFactoryAbi,
    functionName: "create",
    args: [
      whitelistTokens || [],
      tokenDistribution || [],
      parseEther(amount || "0"),
    ],
  })
  const {
    error: createError,
    isError: isCreateError,
    data: createData,
    write: create,
  } = useContractWrite(createConfig)

  const { isLoading: isCreateLoading, isSuccess: isCreateSuccess } =
    useWaitForTransaction({
      hash: createData?.hash,
    })

  const handleWhitelistTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const wl = [...whitelistTokens]
    wl[index] = event.target.value
    setWhitelistTokens(wl)
  }

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
        <Field
          description="Select incoming tokens to trigger your Savings contract (ETH is by default an accepted incoming token)"
          label="Whitelisted incoming tokens"
          labelSecondary={
            <PlusSVG
              className="cursor-pointer"
              onClick={() => setWhitelistTokens([...whitelistTokens, ""])}
            />
          }
        >
          <>
            {whitelistTokens.map((token, index) => (
              <div className="flex items-center gap-2" key={index}>
                <Select
                  autocomplete
                  label
                  className="grow"
                  options={incomingTokens}
                  onChange={(e) => handleWhitelistTokenChange(e, index)}
                  placeholder="Select incoming token..."
                />

                {whitelistTokens.length > 1 ? (
                  <CrossCircleSVG
                    onClick={() =>
                      setWhitelistTokens([
                        ...whitelistTokens.slice(0, index),
                        ...whitelistTokens.slice(index + 1),
                      ])
                    }
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          </>
        </Field>

        <div className="my-6">
          <Field
            description="Set your preferred tokens in savings along with their distributions"
            label="Choose token distributions"
            labelSecondary={
              <PlusSVG
                className="cursor-pointer font-xl"
                onClick={() =>
                  setTokenDistribution([
                    ...tokenDistribution,
                    newTokenDistribution,
                  ])
                }
              />
            }
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
                        options={[
                          {
                            value: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                            label: "ETH",
                          },
                          ...incomingTokens,
                        ]}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Select outgoing token..."
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
                      {tokenDistribution.length > 1 ? (
                        <CrossCircleSVG
                          onClick={() =>
                            setTokenDistribution([
                              ...tokenDistribution.slice(0, index),
                              ...tokenDistribution.slice(index + 1),
                            ])
                          }
                          className="cursor-pointer hover:"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
            </>
          </Field>
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
          {isApproveSuccess ? (
            <>
              <Button width="fit" onClick={create} disabled={isCreateLoading}>
                {isCreateLoading ? (
                  <div className="flex justify-center gap-2">
                    Creating
                    <Spinner />
                  </div>
                ) : (
                  "Create Savings"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button width="fit" onClick={approve} disabled={isApproveLoading}>
                {isApproveLoading ? (
                  <div className="flex justify-center gap-2">
                    Approving
                    <Spinner />
                  </div>
                ) : (
                  "Approve LINK"
                )}
              </Button>
              {/* {(isApprovePrepareError || isApproveError) && (
                <div className="text-center text-red-500">
                  Error: {(approvePrepareError || approveError)?.message}
                </div>
              )} */}
            </>
          )}
        </div>
      </Card>
    </>
  )
}
