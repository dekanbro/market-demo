'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { encodeFunctionData } from 'viem'
import { Loader2, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { MarketMakerAbi } from '@/app/lib/contracts/abis/market-maker'
import { getDaoById } from '@/app/lib/dao-service'

interface ExecuteDialogProps {
  shamanAddress: string
  chainId?: string
  daoId: string
  onSuccess?: () => void
}

export function ExecuteDialog({ shamanAddress, chainId, daoId, onSuccess }: ExecuteDialogProps) {
  const { login, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleExecute = async () => {
    if (!authenticated) {
      login()
      return
    }

    setIsLoading(true)
    try {
      const data = encodeFunctionData({
        abi: MarketMakerAbi,
        functionName: 'execute',
      })

      const provider = await wallets[0].getEthereumProvider()
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          to: shamanAddress,
          from: wallets[0].address,
          data
        }]
      })

      // Wait for transaction confirmation
      const maxAttempts = 20
      let attempts = 0
      while (attempts < maxAttempts) {
        const receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })
        
        if (receipt) {
          setIsOpen(false)
          if (onSuccess) {
            onSuccess()
          }
          toast.success('Market maker executed successfully')
          break
        }
        
        await new Promise(r => setTimeout(r, 3000))
        attempts++
      }

    } catch (error) {
      console.error('Execute failed:', error)
      toast.error('Failed to execute market maker')
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
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Execute Market Maker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Execute Market Maker</DialogTitle>
          <DialogDescription>
            This will execute the market maker contract, creating a Uniswap pool with the collected ETH and tokens.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExecute}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Execute
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 