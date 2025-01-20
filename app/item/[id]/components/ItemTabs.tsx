'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Item } from "@/app/data/items"
import { addons } from "@/app/data/addons"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip } from 'recharts'
import Image from "next/image"

const chartData = [
  { name: 'Jan', price: 0.0001 },
  { name: 'Feb', price: 0.0002 },
  { name: 'Mar', price: 0.0003 },
  { name: 'Apr', price: 0.0005 },
  { name: 'May', price: 0.0008 },
];

export function ItemTabs({ item }: { item: Item }) {
  return (
    <Tabs defaultValue="chart" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="chart">Price History</TabsTrigger>
        <TabsTrigger value="addons">Add-ons</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart">
        <Card>
          <CardContent className="pt-6">
            <LineChart
              width={800}
              height={300}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="var(--primary)" 
                strokeWidth={2} 
              />
            </LineChart>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="addons">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <Card key={addon.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Image
                      src={addon.icon}
                      alt={addon.title}
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{addon.title}</h3>
                    <p className="text-sm text-muted-foreground">{addon.price} ETH/{addon.billingPeriod}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {addon.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground">{item.description}</p>
            <h3 className="font-semibold">Status</h3>
            <p className="text-muted-foreground capitalize">{item.status}</p>
            {item.comingSoon && (
              <p className="text-yellow-500">This agent is coming soon!</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 