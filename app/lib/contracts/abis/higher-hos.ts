export const HigherHOSAbi =
  [
    {
      inputs: [
        {
          internalType: "address",
          name: "yeet24Summoner",
          type: "address",
        },
        { internalType: "address", name: "posterAddress", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "_posterAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "_yeet24Summoner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "initializationLootTokenParams",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "initializationShareTokenParams",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "initializationShamanParams",
          type: "bytes",
        },
        { internalType: "uint256", name: "saltNonce", type: "uint256" },
        { internalType: "string", name: "daoName", type: "string" },
      ],
      name: "summonBaalFromReferrer",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;
