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
    id: 'farcastle',
    title: 'Farcaster Bot',
    description: 'Post updates, engage with followers, and monitor relevant conversations.',
    price: 0.01,
    type: 'integration',
    icon: '/placeholder.svg?height=20&width=20',
    billingPeriod: 'monthly'
  },
  {
    id: 'liquid-intelligence',
    title: 'Socials Bot',
    description: ' Interact with community members and provide automated support. Analyze social media data to understand trends and engagement.',
    price: 0.015,
    type: 'integration',
    icon: '/placeholder.svg?height=20&width=20',
    billingPeriod: 'monthly'
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Ratify documents and access to a comprehensive knowledge base of information about the DAO.',
    price: 0.01,
    type: 'integration',
    icon: '/placeholder.svg?height=20&width=20',
    billingPeriod: 'monthly'
  },
  {
    id: 'second-brain',
    title: 'Second Brain',
    description: 'Personalized AI assistant to help you engage with your DAO.',
    price: 0.01,
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