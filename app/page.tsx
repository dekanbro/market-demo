import { ItemCard } from './components/ItemCard'
import { Marquee } from './components/Marquee'
import { items } from './data/items'

export default function Home() {
  const featuredItems = items.filter(item => item.status === 'featured');
  const activedItems = items.filter(item => item.status === 'active');

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Agent Marketplace</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Featured Agents</h2>
        <Marquee>
          <div className="flex space-x-4 py-4">
            {featuredItems.map((item) => (
              <div key={item.id} className="w-64 flex-shrink-0">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Active Presales</h2>
        <Marquee direction="right" speed={25}>
          <div className="flex space-x-4 py-4">
            {activedItems.map((item) => (
              <div key={item.id} className="w-64 flex-shrink-0">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Agents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

