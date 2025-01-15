'use client'

import { useState } from 'react'
import { ChatWindow } from '@/app/components/ChatWindow'
import { items } from '../../data/items'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { name: 'Jan', price: 100 },
  { name: 'Feb', price: 120 },
  { name: 'Mar', price: 110 },
  { name: 'Apr', price: 140 },
  { name: 'May', price: 130 },
  { name: 'Jun', price: 150 },
]

const historyData = [
  { date: '2023-06-01', event: 'Item listed' },
  { date: '2023-06-15', event: 'Price reduced' },
  { date: '2023-07-01', event: 'Featured in summer collection' },
]

const linksData = [
  { title: 'Manufacturer Website', url: 'https://example.com/manufacturer' },
  { title: 'Product Manual', url: 'https://example.com/manual.pdf' },
  { title: 'Video Review', url: 'https://youtube.com/watch?v=example' },
]

const commentsData = [
  { user: 'Alice', comment: 'Great product! Highly recommended.' },
  { user: 'Bob', comment: 'Good value for money.' },
  { user: 'Charlie', comment: 'Arrived quickly and in perfect condition.' },
]

export default function ItemPage({ params }: { params: { id: string } }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const item = items.find((i) => i.id === parseInt(params.id))

  if (!item) {
    return <div className="text-foreground">Item not found</div>
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { user: 'You', message: inputMessage }])
      setInputMessage('')
      // Simulate a response (you'd replace this with actual API call in a real app)
      setTimeout(() => {
        setChatMessages(prev => [...prev, { user: 'Bot', message: `Thanks for your message about ${item.title}. How can I help you?` }])
      }, 1000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="text-primary hover:underline mb-4 inline-block">
        &larr; Back to list
      </Link>
      <div className="bg-card shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">{item.title}</h1>
            <p className="text-muted-foreground mb-4">{item.description}</p>
            <p className="text-xl md:text-2xl font-bold mb-6 text-primary">
              ${item.price.toFixed(4)}
            </p>
            <div className="flex space-x-4">
              <Button className="flex-1">Add to Cart</Button>
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="flex-1">Chat</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Chat about {item.title}</DrawerTitle>
                  </DrawerHeader>
                  <ChatWindow agentName={item.title} itemId={item.id} />
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <Drawer open={isProfileDrawerOpen} onOpenChange={setIsProfileDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="secondary" className="flex-1">
                    Propose Profile Change
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Propose Changes to {item.title}</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <ChatWindow 
                      agentName={item.title} 
                      itemId={item.id} 
                      initialMessage="I'm ready to hear your suggestions for improving my profile. What changes would you propose?"
                    />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <Card>
            <CardContent className="pt-6">
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent>
              <ul className="space-y-4">
                {historyData.map((event, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="font-medium">{event.date}</span>
                    <span>{event.event}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links">
          <Card>
            <CardContent>
              <ul className="space-y-4">
                {linksData.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardContent>
              <ul className="space-y-4">
                {commentsData.map((comment, index) => (
                  <li key={index} className="border-b border-border pb-4 last:border-b-0">
                    <p className="font-medium">{comment.user}</p>
                    <p className="text-muted-foreground">{comment.comment}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

