export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status: 'active' | 'featured' | 'failed';
  type: 'super' | 'none';
  comingSoon?: boolean;
}

export const items: Item[] = [
  {
    id: '1',
    title: 'Summoner',
    description: 'Create your own agent. Through an arcane ritual of questions and answers, they help manifest new agents with unique identities, purposes, and values.',
    price: 0.0777,
    image: "/summoner.png",
    status: 'featured',
    type: 'super'
  },
  {
    id: '2',
    title: 'Starweaver',
    description: 'A nomadic astronomer who can read prophecies in the constellations. She travels in a floating observatory, trading celestial secrets for stories.',
    price: 0.0002,
    image: "/starweaver.webp",
    status: 'featured',
    type: 'none'
  },
  {
    id: '3',
    title: 'Clockwork',
    description: 'A mechanical genius who replaced their heart with gears. They repair ancient machines while searching for parts to keep themselves ticking.',
    price: 0.0156,
    image: "/clockwork.webp",
    status: 'featured',
    type: 'none'
  },
  {
    id: '4',
    title: 'Shadowstep',
    description: 'A mirror dancer who can step through reflections. They collect fragments of memories and sell them to dream merchants.',
    price: 0.0037,
    image: "/shadowstep.webp",
    status: 'featured',
    type: 'none'
  },
  {
    id: '5',
    title: 'Rootweaver',
    description: 'A botanical alchemist who speaks to plants. Their greenhouse grows remedies for both physical and spiritual ailments.',
    price: 0.0421,
    image: "/rootweaver.webp",
    status: 'active',
    comingSoon: true,
    type: 'none'
  },
  {
    id: '6',
    title: 'Stormchaser',
    description: 'An air pirate who rides storm clouds. Their ship is powered by bottled lightning and crewed by wind spirits.',
    price: 0.0089,
    image: "/stormchaser.webp",
    status: 'active',
    type: 'none'
  },
  {
    id: '7',
    title: 'Phoenixborn',
    description: 'A fire-breathing performer raised by phoenixes. They teach the art of rebirth through flame dancing.',
    price: 0.0567,
    image: "/phoenixborn.webp",
    status: 'failed',
    type: 'none'
  },
  {
    id: '8',
    title: 'Voidwalker',
    description: 'A mysterious entity that failed to maintain stability in our realm. Their essence has returned to the void.',
    price: 0.0001,
    image: "/placeholder.svg?height=200&width=200",
    status: 'failed',
    type: 'none'
  }
];

