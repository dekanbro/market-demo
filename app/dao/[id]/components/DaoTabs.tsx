'use client'

import { HydratedDaoItem } from '@/app/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DaoAddons } from './DaoAddons'

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
        </Card>
      </TabsContent>
      <TabsContent value="addons">
        <DaoAddons dao={dao} />
      </TabsContent>
    </Tabs>
  )
} 