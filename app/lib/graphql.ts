import { GraphQLClient } from 'graphql-request'

interface GraphUrlParams {
  chainId: string;
  graphKey: string;
  subgraphKey: string;
}

type KEYCHAIN = Record<string, string>;
type KeychainList = Record<string, KEYCHAIN>;

const SUBGRAPH_IDS: KeychainList = {
  YEETER: {
    "0xaa36a7": "8Syem3ZN88cut1wL8AqPHNo658Px7M2CkRuHAGuxvf6j",
    "0x64": "EGG5xEkiKKtGa9frTfBSmL2w7ZmzPDke5ZuvxDRwQcGe",
    "0xa": "55wEbRchfvjtWsy5NqLc4hp9C7xbX9yk8bAr3UQA8F7x",
    "0xa4b1": "BeGugH1TsMspZ7Nov1Uq2PQ98X78sqjuEy1JFGLyNgt5",
    "0x2105": "6vyAqRpCyrhLsfd6TfYAssvKywKhxJykkDbPxJZ4ZcEr",
  },
  DAOHAUS: {
    "0xaa36a7": "3k93SNY5Y1r4YYWEuPY9mpCm2wnGoYDKRtk82QZJ3Kvw",
    "0x64": "6x9FK3iuhVFaH9sZ39m8bKB5eckax8sjxooBPNKWWK8r",
    "0xa": "CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW",
    "0xa4b1": "GPACxuMWrrPSEJpFqupnePJNMfuArpFabrXLnWvXU2bp",
    "0x2105": "7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW",
  },
};

export function getGraphUrl({ chainId, graphKey, subgraphKey }: GraphUrlParams): string {
  const subgraphHash = SUBGRAPH_IDS[subgraphKey]?.[chainId];
  
  if (!subgraphHash) {
    console.log("[GraphQL] Invalid chainId or subgraphKey:", { chainId, subgraphKey });
  }

  const url = `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/${subgraphHash}`;
  console.log("[GraphQL] URL:", url);
  return url;
}

export function getGraphClient(params: GraphUrlParams): GraphQLClient {
  const url = getGraphUrl(params)
  console.log("[GraphQL] Client params:", params);
  
  return new GraphQLClient(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
} 