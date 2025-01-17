import { useState, useEffect } from 'react';
import { useEnsName, useEnsAvatar } from 'wagmi';

interface EnsProfile {
  name: string | null;
  avatar: string | null;
  address: string;
}

export function truncateAddress(address: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function useEnsProfile(address?: string) {
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1
  });

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1
  });

  const profile: EnsProfile | null = address ? {
    name: ensName || null,
    avatar: avatar || null,
    address
  } : null;

  return { 
    profile, 
    loading: isLoadingName || isLoadingAvatar 
  };
} 