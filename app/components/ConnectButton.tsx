'use client'

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UserProfile } from '@/app/components/UserProfile';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export function ConnectButton() {
  const { login, authenticated, ready, logout, user } = usePrivy();

  if (!ready) return null;

  if (!authenticated) {
    return (
      <Button onClick={login}>
        Connect
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserProfile 
            address={user?.wallet?.address} 
            showAvatar={true}
            size="sm"
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect Wallet</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disconnect your wallet? You will need to reconnect to access protected features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 