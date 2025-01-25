'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { addons } from '@/app/data/addons'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const mockData = [
  { date: '2024-01', value: 0 },
  { date: '2024-02', value: 2 },
  { date: '2024-03', value: 5 },
  { date: '2024-04', value: 8 },
  { date: '2024-05', value: 12 },
]

export function DaoTabs({ dao }: { dao: HydratedDaoItem }) {
  return (
    <Tabs defaultValue="chart" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chart">Chart</TabsTrigger>
        <TabsTrigger value="addons">Operator Addons</TabsTrigger>
      </TabsList>
      <TabsContent value="chart">
        <Card className="p-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{dao.activeMemberCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Proposals</p>
              <p className="text-2xl font-bold">{dao.proposalCount}</p>
            </div>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="addons">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <Card key={addon.id} className="relative overflow-hidden group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{addon.title}</CardTitle>
                  <Badge variant="secondary">
                    {addon.price} ETH/{addon.billingPeriod}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{addon.description}</p>
                <div className="mt-4">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    {addon.type}
                  </Badge>
                </div>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-pink-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity" />
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
} 