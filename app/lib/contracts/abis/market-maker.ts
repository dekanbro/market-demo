export const MarketMakerAbi = 
  [
    {
      inputs: [],
      name: "AdminShaman__NoAdminRole",
      type: "error",
    },
    {
      inputs: [],
      name: "ManagerShaman__NoManagerRole",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "guard_",
          type: "address",
        },
      ],
      name: "NotIERC165Compliant",
      type: "error",
    },
    {
      inputs: [],
      name: "ShamanBase__InvalidAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "ShamanBase__InvalidName",
      type: "error",
    },
    {
      inputs: [],
      name: "Yeet24ShamanModule__AlreadyExecuted",
      type: "error",
    },
    {
      inputs: [],
      name: "Yeet24ShamanModule__BaalVaultOnly",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "returnData",
          type: "bytes",
        },
      ],
      name: "Yeet24ShamanModule__ExecutionFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "Yeet24ShamanModule__InvalidEndTime",
      type: "error",
    },
    {
      inputs: [],
      name: "Yeet24ShamanModule__InvalidPoolFee",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "returnData",
          type: "bytes",
        },
      ],
      name: "Yeet24ShamanModule__TransferFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "Yeet24ShamanModule__YeetNotFinished",
      type: "error",
    },
    {
      inputs: [],
      name: "ZodiacModuleShaman__NotEnabledModule",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousAvatar",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newAvatar",
          type: "address",
        },
      ],
      name: "AvatarSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "BoostRewardsDeposited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "guard",
          type: "address",
        },
      ],
      name: "ChangedGuard",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenSupply",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ethSupply",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "boostRewards",
          type: "uint256",
        },
      ],
      name: "Executed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "yeethBalance",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "boostRewards",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "forwardedToRewardsPool",
          type: "bool",
        },
      ],
      name: "ExecutionFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "baal",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "vault",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "goal",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "poolFee",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "boostRewardsPool",
          type: "address",
        },
      ],
      name: "Setup",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "ShamanBalanceWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousTarget",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newTarget",
          type: "address",
        },
      ],
      name: "TargetSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "pool",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "positionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint160",
          name: "sqrtPriceX96",
          type: "uint160",
        },
        {
          indexed: false,
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
      ],
      name: "UniswapPositionCreated",
      type: "event",
    },
    {
      inputs: [],
      name: "avatar",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "baal",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "balance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "boostRewardsPool",
      outputs: [
        {
          internalType: "address payable",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "from",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amount",
          type: "uint256[]",
        },
      ],
      name: "burnLoot",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "from",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amount",
          type: "uint256[]",
        },
      ],
      name: "burnShares",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token0",
          type: "address",
        },
        {
          internalType: "address",
          name: "token1",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "liquidityAmount0",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "liquidityAmount1",
          type: "uint256",
        },
      ],
      name: "createPoolAndMintPosition",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "enum Enum.Operation",
          name: "_operation",
          type: "uint8",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_callData",
          type: "bytes",
        },
      ],
      name: "encodeMultiSendAction",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "endTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "execute",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "executed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGuard",
      outputs: [
        {
          internalType: "address",
          name: "_guard",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "goal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "goalAchieved",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "guard",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isAdmin",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isManager",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "to",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amount",
          type: "uint256[]",
        },
      ],
      name: "mintLoot",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "to",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amount",
          type: "uint256[]",
        },
      ],
      name: "mintShares",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "moduleEnabled",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nonfungiblePositionManager",
      outputs: [
        {
          internalType: "contract INonfungiblePositionManager",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pool",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "poolFee",
      outputs: [
        {
          internalType: "uint24",
          name: "",
          type: "uint24",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "positionId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "pauseShares",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "pauseLoot",
          type: "bool",
        },
      ],
      name: "setAdminConfig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_avatar",
          type: "address",
        },
      ],
      name: "setAvatar",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guard",
          type: "address",
        },
      ],
      name: "setGuard",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_target",
          type: "address",
        },
      ],
      name: "setTarget",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "_initializeParams",
          type: "bytes",
        },
      ],
      name: "setUp",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_baal",
          type: "address",
        },
        {
          internalType: "address",
          name: "_vault",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_initializeParams",
          type: "bytes",
        },
      ],
      name: "setup",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "target",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "vault",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "weth",
      outputs: [
        {
          internalType: "contract IWETH9",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawShamanBalance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ] as const;
