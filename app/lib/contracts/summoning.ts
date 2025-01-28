import {
  createPublicClient,
  http,
  type PublicClient as ViemPublicClient,
  type Hash,
  type Address,
  keccak256,
  encodePacked,
  encodeFunctionData,
  zeroAddress,
  getAddress,
  encodeAbiParameters,
  parseAbiParameters,
  getContractAddress,
  hexToBigInt,
} from "viem";
import { ethers } from "ethers";
import { base } from "viem/chains";
import { ADDITIONAL_ADDRESSES, CONTRACT_ADDRESSES } from "../wagmi";

import {
  Yeet24HOSSummonerAbi,
  BasicHOSSummonerAbi,
  BaalAbi,
  PosterAbi,
  SafeL2Abi,
  GnosisSafeProxyFactoryAbi,
  SafeFactoryAbi,
} from "./abis";
import {
  isEthAddress,
  getSaltNonce,
  isNumberish,
  validateAndConvertPrice,
} from "./helpers";
import { DaoParams, YeeterConfig, EncodedParams } from "./types";
import {
  DEFAULT_DAO_PARAMS,
  DEFAULT_YEETER_VALUES,
  DEFAULT_MEME_YEETER_VALUES,
  MM_SHAMAN_PERMISSIONS,
  DEFAULT_DURATION,
  YEET_SHAMAN_PERMISSIONS,
  DEFAULT_GOAL,
  END_TIME,
  START_TIME,
  SHARES_TRANSFER_PAUSED,
  LOOT_TRANSFER_PAUSED,
} from "./constants";

// Create public client for contract reads
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
  batch: {
    multicall: true,
  },
}) as ViemPublicClient;

/**
 * Calculates the deterministic DAO address based on salt nonce
 * @param saltNonce - Unique identifier for the DAO
 * @param client - Optional viem public client
 * @returns Promise resolving to the DAO address
 * @throws {Error} If summoner address is invalid or contract call fails
 */
export async function calculateDaoAddress(
  saltNonce: bigint,
  client: ViemPublicClient = publicClient
): Promise<Address> {
  const summonerAddress = CONTRACT_ADDRESSES[base.id].YEET24_SUMMONER;

  if (!isEthAddress(summonerAddress).isValid) {
    throw new Error("Invalid summoner contract address");
  }

  try {
    const daoAddress = await client.readContract({
      address: summonerAddress,
      abi: BasicHOSSummonerAbi,
      functionName: "calculateBaalAddress",
      args: [saltNonce],
    });

    if (!isEthAddress(daoAddress as string).isValid) {
      throw new Error("Invalid DAO address returned from contract");
    }

    return daoAddress as Address;
  } catch (error) {
    console.error("Error calculating DAO address:", error);
    throw new Error("Failed to calculate DAO address");
  }
}

/**
 * Calculates the deterministic proxy address for a safe
 * @param saltNonce - Unique identifier for the safe
 * @param client - Optional viem public client
 * @returns Promise resolving to the safe proxy address
 * @throws {Error} If contract addresses are invalid or call fails
 */
export async function calculateCreateProxyWithNonceAddress(
  saltNonce: bigint,
  fromAddress: Address, // member address
  client: ViemPublicClient = publicClient
): Promise<Address> {
  const gnosisSafeProxyFactoryAddress =
    CONTRACT_ADDRESSES[base.id].GNOSIS_SAFE_PROXY_FACTORY;
  const safeFactoryAddress = CONTRACT_ADDRESSES[base.id].SAFE_FACTORY;
  const masterCopyAddress = CONTRACT_ADDRESSES[base.id].SAFE_SINGLETON;
  const baalSummonerAddress = CONTRACT_ADDRESSES[base.id].BAAL_SUMMONER;
  const initializer = "0x"; // Empty initializer

  if (!isEthAddress(gnosisSafeProxyFactoryAddress).isValid) {
    throw new Error("Invalid safe factory address");
  }
  if (!isEthAddress(masterCopyAddress).isValid) {
    throw new Error("Invalid safe singleton address");
  }

  let expectedSafeAddress: Address = zeroAddress;


  // create a new ethers contract
  const provider = new ethers.JsonRpcProvider(
    "https://mainnet.base.org",
    8453
  );

  
  // const signer = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY as string, provider);
  const gnosisSafeProxyFactory = new ethers.Contract(
    gnosisSafeProxyFactoryAddress,
    GnosisSafeProxyFactoryAbi,
    provider
  );

  try {
    await gnosisSafeProxyFactory.calculateCreateProxyWithNonceAddress.estimateGas(
      masterCopyAddress,
      initializer,
      saltNonce,
      { from: gnosisSafeProxyFactoryAddress }
    );
  } catch (e: any) {
    expectedSafeAddress = getSafeAddressFromRevertMessage(e);
  }

  //   try {
  //   const creationCode = await client.readContract({
  //     address: gnosisSafeProxyFactoryAddress,
  //     abi: GnosisSafeProxyFactoryAbi,
  //     functionName: "proxyCreationCode",
  //     args: [],
  //   });

  //   const deploymentCode = encodePacked(
  //     ['bytes', 'uint256'],
  //     [creationCode, hexToBigInt(masterCopyAddress)]
  //   )

  //   const salt = keccak256(encodePacked(['bytes32', 'uint256'], [keccak256(encodePacked(['bytes'], [initializer])), saltNonce]))

  //   console.log("creationCode", creationCode);
  //   console.log("fromAddress", fromAddress);
  //   console.log("saltNonce", saltNonce, `0x${saltNonce.toString(16)}` as `0x${string}`);
  //   expectedSafeAddress = getContractAddress({
  //     opcode: "CREATE2",
  //     from: baalSummonerAddress as Address,
  //     salt: salt,
  //     bytecode: deploymentCode,
  //   })
  //   console.log("expectedSafeAddress", expectedSafeAddress);
  //   const expectedSafeAddress2 = getContractAddress({
  //     opcode: "CREATE2",
  //     from: fromAddress as Address,
  //     salt: salt,
  //     bytecode: deploymentCode,
  //   })
  //   console.log("expectedSafeAddress2", expectedSafeAddress2);
  // } catch (e: any) {
  //   // Extract the expected safe address from the revert message
  //   console.log("something went wrong with calculateCreateProxyWithNonceAddress", e);
  //   throw new Error("Failed to calculate safe address");

  // }

  // try {
  //   // Attempt to call the function to estimate gas, expecting it to revert
  //   await client.simulateContract({
  //     address: gnosisSafeProxyFactoryAddress,
  //     abi: GnosisSafeProxyFactoryAbi,
  //     functionName: "calculateCreateProxyWithNonceAddress",
  //     args: [masterCopyAddress, initializer, saltNonce],
  //   });
  // } catch (e: any) {
  //   // Extract the expected safe address from the revert message
  //   expectedSafeAddress = getSafeAddressFromRevertMessage(e);
  // }

  if (expectedSafeAddress === zeroAddress) {
    throw new Error("Failed to calculate safe address");
  }

  return expectedSafeAddress;
}

const getSafeAddressFromRevertMessage = (e: any): Address => {
  let safeAddress: Address;

  // Fallback to old error format
  if (e?.data) {
    safeAddress = getAddress(`0x${e.data.slice(138, 178)}`) as Address;
  } else {
    // Try to find any hex address in the error message
    const messages: string[] = e.message?.split(" ") || [];
    const addressMatch = messages.find((m) => /^0x[a-fA-F0-9]{40}$/.test(m));
    safeAddress = addressMatch
      ? (getAddress(addressMatch) as Address)
      : zeroAddress;
  }

  if (safeAddress === zeroAddress) {
    console.error("Failed to extract safe address from error:", e);
  }

  return safeAddress;
};

/**
 * Assembles token parameters for yeeter configuration
 * @param config - Partial yeeter configuration
 * @returns Encoded token parameters
 * @throws {Error} If token configuration is invalid
 */
export function assembleLootTokenParams(
  config: Partial<YeeterConfig> = {}
): `0x${string}` {
  const lootSingleton = CONTRACT_ADDRESSES[base.id].LOOT_SINGLETON;

  const {
    startTime = START_TIME,
    endTime = END_TIME,
    tokenConfig = DEFAULT_YEETER_VALUES.TOKEN_CONFIG,
  } = config;

  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  if (!tokenConfig.name.trim() || !tokenConfig.symbol.trim()) {
    throw new Error("Token name and symbol cannot be empty");
  }

  const lootParams = encodeAbiParameters(parseAbiParameters("string,string"), [
    tokenConfig.name.trim() + "-LOOT",
    "l" + tokenConfig.symbol.trim(),
  ]);

  return encodeAbiParameters(parseAbiParameters("address,bytes"), [
    lootSingleton,
    lootParams,
  ]);
}

/**
 * Assembles shares token parameters for yeeter configuration
 * @param config - Partial yeeter configuration
 * @returns Encoded token parameters
 * @throws {Error} If token configuration is invalid
 */
export function assembleSharesTokenParams(
  config: Partial<YeeterConfig> = {}
): `0x${string}` {
  const sharesSingleton = CONTRACT_ADDRESSES[base.id].SHARES_SINGLETON;

  const {
    startTime = START_TIME,
    endTime = END_TIME,
    tokenConfig = DEFAULT_YEETER_VALUES.TOKEN_CONFIG,
  } = config;

  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  if (!tokenConfig.name.trim() || !tokenConfig.symbol.trim()) {
    throw new Error("Token name and symbol cannot be empty");
  }

  const sharesParams = encodeAbiParameters(
    parseAbiParameters("string,string"),
    [tokenConfig.name.trim(), tokenConfig.symbol.trim()]
  );

  return encodeAbiParameters(parseAbiParameters("address,bytes"), [
    sharesSingleton,
    sharesParams,
  ]);
}

export function shamanModuleConfigTx(
  calculatedShamanAddress: Address,
  calculatedTreasuryAddress: Address
): string {
  if (
    !isEthAddress(calculatedShamanAddress).isValid ||
    !isEthAddress(calculatedTreasuryAddress).isValid
  ) {
    throw new Error(
      "shamanModuleConfigTX received arguments in the wrong shape or type"
    );
  }

  const addModule = encodeFunctionData({
    abi: SafeL2Abi,
    functionName: "enableModule",
    args: [calculatedShamanAddress],
  });

  const execTxFromModule = encodeFunctionData({
    abi: SafeL2Abi,
    functionName: "execTransactionFromModule",
    args: [calculatedTreasuryAddress, BigInt(0), addModule, 0],
  });

  const encoded = encodeFunctionData({
    abi: BaalAbi,
    functionName: "executeAsBaal",
    args: [calculatedTreasuryAddress, BigInt(0), execTxFromModule],
  });
  if (typeof encoded === "string") {
    return encoded;
  }
  throw new Error("Encoding Error");
}

export function metadataConfigTx(
  yeeterConfig: Partial<YeeterConfig> = {},
  calculatedDaoAddress: string
): string {
  const {
    daoName = yeeterConfig.daoName,
    imageUrl = yeeterConfig.imageUrl,
    description = yeeterConfig.description,
    memberAddress = yeeterConfig.memberAddress,
  } = yeeterConfig;

  if (typeof daoName !== "string") {
    throw new Error("metadataTX received arguments in the wrong shape or type");
  }

  const content = {
    name: daoName,
    daoId: calculatedDaoAddress,
    table: "daoProfile",
    queryType: "list",
    description: description || "",
    avatarImg: imageUrl || "",
    title: `${daoName} tst`,
    tags: ["YEET24", "AGENT", "MARKET"],
    authorAddress: memberAddress,
  };

  const metadata = encodeFunctionData({
    abi: PosterAbi,
    functionName: "post",
    args: [JSON.stringify(content), "daohaus.summoner.daoProfile"],
  });
  const encoded = encodeFunctionData({
    abi: BaalAbi,
    functionName: "executeAsBaal",
    args: [CONTRACT_ADDRESSES[base.id].POSTER, BigInt(0), metadata],
  });

  return encoded;
}

export function governanceConfigTx(
  daoAddress: Address,
  daoParams: Partial<DaoParams> = {}
): string {
  const {
    votingPeriod = DEFAULT_DAO_PARAMS.VOTING_PERIOD,
    gracePeriod = DEFAULT_DAO_PARAMS.GRACE_PERIOD,
    proposalOffering = DEFAULT_DAO_PARAMS.PROPOSAL_OFFERING,
    quorum = DEFAULT_DAO_PARAMS.QUORUM,
    sponsorThreshold = DEFAULT_DAO_PARAMS.SPONSOR_THRESHOLD,
    minRetention = DEFAULT_DAO_PARAMS.MIN_RETENTION,
  } = daoParams;

  // Encode governance config
  const encodedGovernanceConfig = encodeAbiParameters(
    parseAbiParameters("uint32,uint32,uint256,uint256,uint256,uint256"),
    [
      votingPeriod,
      gracePeriod,
      BigInt(proposalOffering),
      BigInt(quorum),
      BigInt(sponsorThreshold),
      BigInt(minRetention),
    ]
  );
  return encodeFunctionData({
    abi: BaalAbi,
    functionName: "setGovernanceConfig",
    args: [encodedGovernanceConfig],
  });
}

export function tokenConfigTx(
  daoAddress: Address,
  tokenConfig: Partial<YeeterConfig> = {}
): string {
  return encodeFunctionData({
    abi: BaalAbi,
    functionName: "setAdminConfig",
    args: [SHARES_TRANSFER_PAUSED, LOOT_TRANSFER_PAUSED], // loot/shares paused true
  });
}

//     return init_actions
/**
 * Assembles initialization actions for DAO
 * @param daoParams - DAO configuration parameters
 * @param tokenParams - Encoded token parameters
 * @param shamanParams - Encoded shaman parameters
 * @returns Array of encoded initialization actions
 * @throws {Error} If any parameters are invalid
 */
export function assembleDaoInitActions(
  daoAddress: Address,
  shamanAddress: Address,
  treasuryAddress: Address,
  daoParams: Partial<DaoParams> = {},
  yeeterConfig: Partial<YeeterConfig> = {},
  shamanParams: string
): string[] {
  if (!shamanParams.startsWith("0x")) {
    throw new Error("Invalid shaman parameters: must be hex string");
  }

  const {
    votingPeriod = DEFAULT_DAO_PARAMS.VOTING_PERIOD,
    gracePeriod = DEFAULT_DAO_PARAMS.GRACE_PERIOD,
    proposalOffering = DEFAULT_DAO_PARAMS.PROPOSAL_OFFERING,
    quorum = DEFAULT_DAO_PARAMS.QUORUM,
    sponsorThreshold = DEFAULT_DAO_PARAMS.SPONSOR_THRESHOLD,
    minRetention = DEFAULT_DAO_PARAMS.MIN_RETENTION,
  } = daoParams;

  // Validate all numeric parameters
  if (
    !isNumberish(votingPeriod) ||
    !isNumberish(gracePeriod) ||
    !isNumberish(proposalOffering) ||
    !isNumberish(quorum) ||
    !isNumberish(sponsorThreshold) ||
    !isNumberish(minRetention)
  ) {
    throw new Error("Invalid numeric parameter in DAO configuration");
  }

  if (!yeeterConfig.tokenConfig) {
    throw new Error("Invalid token configuration");
  }
  if (!yeeterConfig.memberAddress) {

    throw new Error("Invalid member address");
  }
  if (!yeeterConfig.imageUrl) {
    throw new Error("Invalid image");
  }
  if (!yeeterConfig.description) {
    throw new Error("Invalid description");
  }

  // Encode governance config

  const governanceConfig = governanceConfigTx(daoAddress, daoParams);

  // Encode token transfer config
  const tokenConfig = tokenConfigTx(daoAddress, yeeterConfig);

  const metadataConfig = metadataConfigTx(yeeterConfig, daoAddress);

  // Encode shaman config
  const shamanConfig = shamanModuleConfigTx(shamanAddress, treasuryAddress);

  return [governanceConfig, tokenConfig, metadataConfig, shamanConfig];
}

/**
 * Calculates the deterministic address for a meme shaman
 * @param saltNonce - Unique identifier for the shaman
 * @param client - Optional viem public client
 * @returns Promise resolving to the shaman address
 * @throws {Error} If contract addresses are invalid or call fails
 */
export async function calculateMemeShamanAddress(
  saltNonce: string,
  client: ViemPublicClient = publicClient
): Promise<Address> {
  const yeet24Singleton =
    CONTRACT_ADDRESSES[base.id].YEET24_SINGLETON || zeroAddress;
  const yeet24ShamanSummoner =
    CONTRACT_ADDRESSES[base.id].YEET24_SUMMONER || zeroAddress;

  if (!isEthAddress(yeet24Singleton).isValid) {
    throw new Error("Invalid L2 resolver address");
  }
  if (!isEthAddress(yeet24ShamanSummoner).isValid) {
    throw new Error("Invalid yeeter singleton address");
  }

  let expectedShamanAddress: Address = zeroAddress;

  try {
    expectedShamanAddress = await publicClient.readContract({
      address: yeet24ShamanSummoner,
      abi: Yeet24HOSSummonerAbi,
      functionName: "predictDeterministicShamanAddress",
      args: [yeet24Singleton, BigInt(saltNonce)],
    });

  } catch (e: any) {
    console.log("expectedShamanAddress error", e);
  }

  return expectedShamanAddress;
}

export const generateShamanSaltNonce = ({
  baalAddress,
  index,
  initializeParams,
  saltNonce,
  shamanPermissions,
  shamanTemplate,
}: {
  baalAddress: Address;
  index: bigint;
  shamanPermissions: bigint;
  shamanTemplate: Address;
  initializeParams: `0x${string}`;
  saltNonce: bigint;
}) => {
  return keccak256(
    encodePacked(
      ["address", "uint256", "address", "uint256", "bytes32", "uint256"],
      [
        baalAddress,
        index,
        shamanTemplate,
        shamanPermissions,
        keccak256(initializeParams),
        saltNonce,
      ]
    )
  );
};

/**
 * Assembles parameters for meme shaman initialization
 * @param yeeterConfig - Yeeter configuration parameters
 * @returns Encoded shaman parameters
 * @throws {Error} If parameters are invalid
 */
export function assembleMarketMakerShamanParams(
  daoAddress: Address,
  yeeterConfig: Partial<YeeterConfig> = {}
) {
  const meme_yeeter_shaman_singleton =
    CONTRACT_ADDRESSES[base.id].YEET24_SINGLETON;
  const non_fungible_position_manager =
    ADDITIONAL_ADDRESSES[base.id].UNISWAP_V3_POSITION_MANAGER;
  const weth9 = ADDITIONAL_ADDRESSES[base.id].WETH;
  const yeet24_claim_module = ADDITIONAL_ADDRESSES[base.id].YEET24_CLAIM_MODULE;

  const minThresholdGoal = DEFAULT_GOAL;
  const endTime = END_TIME;
  const poolFee = DEFAULT_MEME_YEETER_VALUES.poolFee;

  const shamanSingleton = CONTRACT_ADDRESSES[base.id].YEET24_SINGLETON;
  const shamanPermission = MM_SHAMAN_PERMISSIONS;
  const shamanInitParams = encodeAbiParameters(
    parseAbiParameters("address,address,address,uint256,uint256,uint24"),
    [
      non_fungible_position_manager,
      weth9,
      yeet24_claim_module,
      BigInt(minThresholdGoal),
      BigInt(endTime),
      parseInt(poolFee) as number,
    ]
  );

  return {
    shamanSingleton,
    shamanPermission,
    shamanInitParams,
  };
}

/**
 * Assembles shaman parameters for yeeter configuration
 * @param yeeterConfig - Yeeter configuration parameters
 * @returns Encoded shaman parameters

 */
export function assembleYeeterShamanParams(
  shamanAddress: Address,
  yeeterConfig: Partial<YeeterConfig> = {}
) {
  const yeeterShamanSingleton = CONTRACT_ADDRESSES[base.id].L2_RESOLVER;

  if (!isEthAddress(yeeterShamanSingleton).isValid) {
    throw new Error("Invalid yeeter shaman singleton address");
  }

  const {
    startTime = START_TIME,
    endTime = startTime + DEFAULT_DURATION,
    price = yeeterConfig.price || "0",
    multiplier = DEFAULT_YEETER_VALUES.multiplier,
    isShares = DEFAULT_YEETER_VALUES.isShares,
    feeRecipients = DEFAULT_YEETER_VALUES.feeRecipients,
    feeAmounts = DEFAULT_YEETER_VALUES.feeAmounts.map((a) => BigInt(a)),
    minThresholdGoal = DEFAULT_GOAL,
  } = yeeterConfig;

  const priceInWei = validateAndConvertPrice(price);

  const feeAmount = BigInt(DEFAULT_YEETER_VALUES.feeAmounts[0]);

  // Encode yeeter shaman p arameters
  const yeeterShamanParams = encodeAbiParameters(
    parseAbiParameters(
      "uint256,uint256,bool,uint256,uint256,uint256,address[],uint256[]"
    ),
    [
      BigInt(startTime),
      BigInt(endTime),
      isShares,
      priceInWei,
      BigInt(multiplier),
      BigInt(minThresholdGoal),
      [...(feeRecipients as Address[]), shamanAddress as Address], // Add DAO address to recipients
      [...feeAmounts, feeAmount] as bigint[], // Add default fee
    ]
  );

  // Encode final parameters
  return {
    shamanSingleton: yeeterShamanSingleton,
    shamanPermission: YEET_SHAMAN_PERMISSIONS,
    shamanInitParams: yeeterShamanParams,
  };
}

// export function assembleShamanParams(
//   daoAddress: Address,
//   yeeterConfig: Partial<YeeterConfig> = {}
// ): {
//   mmShamanSingleton: Address;
//   mmShamanPermission: string;
//   mmShamanParams: string;
//   yShamanSingleton: Address;
//   yShamanPermission: string;
//   yShamanParams: string;
//   encoded: `0x${string}`;
// } {
//   // const marketMakerShamanParams = assembleMarketMakerShamanParams(
//   //   daoAddress,
//   //   yeeterConfig
//   // );
//   // // mm_shaman_singleton = mm_shaman_data["shamanSingleton"]
//   // //   mm_shaman_permission = mm_shaman_data["shamanPermission"]
//   // //   mm_shaman_params = mm_shaman_data["shamanInitParams"]
//   // const mmShamanSingleton = marketMakerShamanParams.shamanSingleton;
//   // const mmShamanPermission = marketMakerShamanParams.shamanPermission;
//   // const mmShamanParams = marketMakerShamanParams.shamanInitParams;

//   // const yeeterShamanParams = assembleYeeterShamanParams(
//   //   daoAddress,
//   //   yeeterConfig
//   // );
//   // const yShamanSingleton = yeeterShamanParams.shamanSingleton;
//   // const yShamanPermission = yeeterShamanParams.shamanPermission;
//   // const yShamanParams = yeeterShamanParams.shamanInitParams;

//   // shaman_singletons = [mm_shaman_singleton, yeeter_shaman_singleton]
//   //   shaman_permissions = [mm_shaman_permission, YEET_SHAMAN_PERMISSIONS]
//   //   shaman_init_params = [mm_shaman_params, yeeter_shaman_params]

//   //   return encode_abi(
//   //       ["address[]", "uint256[]", "bytes[]"],
//   //       [shaman_singletons, shaman_permissions, shaman_init_params]
//   //   )
//   const shamanSingletons = [mmShamanSingleton, yShamanSingleton] as const;
//   const shamanPermissions = [mmShamanPermission, yShamanPermission].map((p) =>
//     BigInt(p)
//   );
//   const shamanInitParams = [mmShamanParams, yShamanParams] as const;

//   return {
//     mmShamanSingleton,
//     mmShamanPermission,
//     mmShamanParams,
//     yShamanSingleton,
//     yShamanPermission,
//     yShamanParams,
//     encoded: encodeAbiParameters(
//       parseAbiParameters("address[],uint256[],bytes[]"),
//       [shamanSingletons, shamanPermissions, shamanInitParams]
//     ) as `0x${string}`,
//   };
// }

/**
 * Assembles all arguments needed for meme yeeter summoning
 * @param daoParams - DAO configuration parameters
 * @param yeeterConfig - Yeeter configuration parameters
 * @returns Promise resolving to tuple of [addresses, parameters]
 * @throws {Error} If any step in the assembly process fails
 */
export async function assembleMemeYeeterSummonerArgs(
  daoParams: Partial<DaoParams> = {},
  yeeterConfig: Partial<YeeterConfig> = {}
): Promise<[`0x${string}`, `0x${string}`, `0x${string}`, string[], bigint]> {
  try {
    // Generate salt nonce and calculate addresses
    const saltNonce = getSaltNonce();
    const daoAddress = await calculateDaoAddress(saltNonce);

    console.log("dao address", daoAddress);

    // Validate contract addresses
    const sharesSingleton = CONTRACT_ADDRESSES[base.id].SHARES_SINGLETON;
    const lootSingleton = CONTRACT_ADDRESSES[base.id].LOOT_SINGLETON;

    if (!isEthAddress(sharesSingleton).isValid) {
      throw new Error("Invalid shares singleton address");
    }
    if (!isEthAddress(lootSingleton).isValid) {
      throw new Error("Invalid loot singleton address");
    }

    // Assemble parameters
    const lootTokenParams = assembleLootTokenParams(yeeterConfig);
    const sharesTokenParams = assembleSharesTokenParams(yeeterConfig);

    //
    const marketMakerShamanParams = assembleMarketMakerShamanParams(
      daoAddress,
      yeeterConfig
    );
    // mm_shaman_singleton = mm_shaman_data["shamanSingleton"]
    //   mm_shaman_permission = mm_shaman_data["shamanPermission"]
    //   mm_shaman_params = mm_shaman_data["shamanInitParams"]
    const mmShamanSingleton = marketMakerShamanParams.shamanSingleton;
    const mmShamanPermission = marketMakerShamanParams.shamanPermission;
    const mmShamanParams = marketMakerShamanParams.shamanInitParams;

    const index = BigInt(0);
    const shamanSaltNonce = generateShamanSaltNonce({
      baalAddress: daoAddress,
      index,
      initializeParams: mmShamanParams as `0x${string}`,
      saltNonce: saltNonce,
      shamanPermissions: BigInt(mmShamanPermission),
      shamanTemplate: mmShamanSingleton as Address,
    });
    const shamanAddress = await calculateMemeShamanAddress(shamanSaltNonce);

    const yeeterShamanParams = assembleYeeterShamanParams(
      shamanAddress,
      yeeterConfig
    );
    const yShamanSingleton = yeeterShamanParams.shamanSingleton;
    const yShamanPermission = yeeterShamanParams.shamanPermission;
    const yShamanParams = yeeterShamanParams.shamanInitParams;

    const shamanSingletons = [mmShamanSingleton, yShamanSingleton] as const;
    const shamanPermissions = [mmShamanPermission, yShamanPermission].map((p) =>
      BigInt(p)
    );
    const shamanInitParams = [mmShamanParams, yShamanParams] as const;

    const encodedShamanParams = encodeAbiParameters(
      parseAbiParameters("address[],uint256[],bytes[]"),
      [shamanSingletons, shamanPermissions, shamanInitParams]
    ) as `0x${string}`
  

    //

    // const shamanParams = assembleShamanParams(daoAddress, yeeterConfig);





    if (!isEthAddress(shamanAddress).isValid) {
      throw new Error("Invalid shaman address");
    }
    if (!yeeterConfig.memberAddress) {
      throw new Error("Invalid member address");
    }
    const treasuryAddress = await calculateCreateProxyWithNonceAddress(
      saltNonce,
      yeeterConfig.memberAddress as Address
    );
    const initActions = assembleDaoInitActions(
      daoAddress,
      shamanAddress,
      treasuryAddress,
      daoParams,
      yeeterConfig,
      encodedShamanParams
    );

    // Return arrays for contract call
    const txArgs: [
      `0x${string}`,
      `0x${string}`,
      `0x${string}`,
      string[],
      bigint
    ] = [
      lootTokenParams,
      sharesTokenParams,
      encodedShamanParams,
      initActions,
      saltNonce,
    ];
    return txArgs;
  } catch (error) {
    console.error("Error assembling meme yeeter arguments:", error);
    throw new Error("Failed to assemble meme yeeter arguments");
  }
}
