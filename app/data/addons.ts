export interface Addon {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'integration' | 'upgrade';
  icon: string;
  billingPeriod: 'monthly';
}

export const addons: Addon[] = [
  {
    id: 'twitter',
    title: 'Twitter Bot',
    description: 'Connect your agent to Twitter. Post updates, engage with followers, and monitor relevant conversations.',
    price: 0.01,
    type: 'integration',
    icon: '/placeholder.svg?height=20&width=20',
    billingPeriod: 'monthly'
  },
  {
    id: 'discord',
    title: 'Discord Bot',
    description: 'Add your agent to Discord servers. Interact with community members and provide automated support.',
    price: 0.015,
    type: 'integration',
    icon: '/placeholder.svg?height=20&width=20',
    billingPeriod: 'monthly'
  },
  {
    id: 'super',
    title: 'Super Upgrade',
    description: 'Upgrade to Super Agent status. Includes advanced AI capabilities, custom tools, and agent pipeline access.',
    price: 0.05,
    type: 'upgrade',
    icon: '/placeholder.svg?height=20&width=20',
    billingPeriod: 'monthly'
  }
]; 