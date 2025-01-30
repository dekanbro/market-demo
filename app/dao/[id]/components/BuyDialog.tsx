'use client'

import { useState, useMemo } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets, useActiveWallet } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { HydratedDaoItem } from '@/app/lib/types'
import { encodeFunctionData, formatEther, parseEther } from 'viem'
import { useEthBalance } from '@/app/hooks/useEthBalance'
import { Loader2 } from 'lucide-react'
import { yeeterAbi } from '@/app/lib/contracts/abis'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

interface BuyDialogProps {
  dao: HydratedDaoItem
  disabled?: boolean
}

export function BuyDialog({ dao, disabled }: BuyDialogProps) {
  const { login, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { refetch: refetchBalance } = useEthBalance(dao.yeeterData?.vault)

  const presetAmounts = useMemo(() => {
    if (!dao.yeeterData?.minTribute) return []
    
    const minTribute = formatEther(BigInt(dao.yeeterData.minTribute))
    const baseAmount = Number(minTribute)
    
    return [
      { label: `${baseAmount} ETH`, value: baseAmount.toString() },
      { label: `${baseAmount * 10} ETH`, value: (baseAmount * 10).toString() },
      { label: `${baseAmount * 100} ETH`, value: (baseAmount * 100).toString() }
    ]
  }, [dao.yeeterData?.minTribute])

  const tokenEstimate = useMemo(() => {
    if (!amount || !dao.yeeterData?.multiplier) return null
    try {
      // Convert amount to Wei
      const amountWei = parseEther(amount)
      const multiplier = Number(dao.yeeterData.multiplier) 
      // Calculate tokens: amount * multiplier
      return Number(formatEther(amountWei)) * multiplier
    } catch (e) {
      return null
    }
  }, [amount, dao.yeeterData?.multiplier])

  const waitForTransaction = async (txHash: string) => {
    const maxAttempts = 20; // 20 * 3s = 60 seconds max wait
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      console.log("waiting for transaction", attempts)
      const provider = await wallets[0].getEthereumProvider();
      const receipt = await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });
      
      if (receipt) {
        return receipt;
      }
      
      await new Promise(r => setTimeout(r, 3000)); // Wait 3 seconds
      attempts++;
    }
    throw new Error('Transaction not mined');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authenticated) {
      login()
      return
    }

    if (!dao.yeeterData?.id) return

    // Ensure the address is properly formatted with 0x prefix
    const toAddress = dao.yeeterData.id.startsWith('0x') 
      ? dao.yeeterData.id as `0x${string}` 
      : `0x${dao.yeeterData.id}` as `0x${string}`

    setIsLoading(true)
    try {
      console.log('Sending to address:', toAddress)
      const data = encodeFunctionData({
        abi: yeeterAbi,
        functionName: 'contributeEth',
        args: [message || '']
      })

      const provider = await wallets[0].getEthereumProvider()
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          to: toAddress,
          from: wallets[0].address,
          value: `0x${parseEther(amount).toString(16)}`,
          data
        }]
      })
      console.log('Transaction hash:', txHash)

      toast.success('Transaction submitted')
      setIsOpen(false)
      
      // Wait for transaction receipt
      await waitForTransaction(txHash as string)
      refetchBalance()
      toast.success('Transaction confirmed')

    } catch (error) {
      console.error('Transaction failed:', error)
      toast.error('Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!wallets?.[0]) {
    return (
      <Button 
        size="lg" 
        className="w-full" 
        onClick={() => login()}
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          disabled={disabled}
        >
          {disabled && dao.comingSoon ? (
            'Coming Soon'
          ) : disabled ? (
            'Presale Ended'
          ) : (
            'Buy Tokens'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {dao.name} Tokens</DialogTitle>
          <DialogDescription>
            Choose an amount of ETH to contribute and add an optional message.
            Minimum contribution: {dao.yeeterData ? formatEther(BigInt(dao.yeeterData.minTribute)) : '0'} ETH
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map(({ label, value }) => (
              <Button
                key={value}
                type="button"
                variant={amount === value ? "default" : "outline"}
                onClick={() => setAmount(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Or enter custom amount (ETH)
            </label>
            <Input
              type="number"
              step={'0.0001'}
              min={dao.yeeterData ? formatEther(BigInt(dao.yeeterData.minTribute)) : '0'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter ETH amount"
            />
            {tokenEstimate && (
              <p className="text-sm text-muted-foreground mt-2">
                You will receive approximately{' '}
                <span className="font-medium text-foreground">
                  {tokenEstimate.toLocaleString(undefined, { 
                    maximumFractionDigits: 2 
                  })}
                </span>{' '}
                {dao.shareTokenSymbol} tokens
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Message (optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to your contribution..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !amount || !tokenEstimate || Boolean(
                dao.yeeterData && 
                parseEther(amount) < BigInt(dao.yeeterData.minTribute)
              )}
            >
              {isLoading ? 'Confirming...' : 'Confirm Purchase'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 