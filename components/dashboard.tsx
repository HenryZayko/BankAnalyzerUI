"use client"

import { useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ArrowDownIcon, ArrowUpIcon, DollarSign, Repeat } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface RecurringTransaction {
  description: string | null
  amount: number | null
  frequency: string | null
}

interface KeyTransaction {
  type: string | null
  description: string | null
  amount: number | null
  frequency: string | null
  estimatedTotalDebt?: string | null
}

interface AnalysisResult {
  analysis: {
    opening_balance: number | null
    ending_balance: number | null
    total_deposits: number | null
    total_withdrawals: number | null
    net_change: number | null
  }
  recurring_transactions: RecurringTransaction[]
  key_transactions: {
    rent_payments: KeyTransaction[] | null
    income_deposits: KeyTransaction[] | null
    utility_payments: KeyTransaction[] | null
    loan_payments: KeyTransaction[] | null
  }
  loan_assessment: {
    decision: string | null
    explanation: string | null
  }
}

interface DashboardProps {
  analysisResult: AnalysisResult
}


export function Dashboard({ analysisResult }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("recurring")

  const chartData = {
    labels: ['Deposits', 'Withdrawals'],
    datasets: [
      {
        label: 'Amount',
        data: [
          analysisResult.analysis.total_deposits ?? 0,
          analysisResult.analysis.total_withdrawals ?? 0
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Deposits vs Withdrawals',
      },
    },
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Financial Snapshot
          </CardTitle>
          <CardDescription>Overview of your financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Opening Balance</p>
              <p className="text-2xl font-semibold">${analysisResult.analysis.opening_balance?.toFixed(2) ?? '0.00'}</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ending Balance</p>
              <p className="text-2xl font-semibold">${analysisResult.analysis.ending_balance?.toFixed(2) ?? '0.00'}</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {(analysisResult.analysis.net_change ?? 0) >= 0 ? (
                <ArrowUpIcon className="h-8 w-8 text-green-500 mb-2" />
              ) : (
                <ArrowDownIcon className="h-8 w-8 text-red-500 mb-2" />
              )}
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Change</p>
              <p className={`text-2xl font-semibold ${(analysisResult.analysis.net_change ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(analysisResult.analysis.net_change ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ArrowUpIcon className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-semibold text-green-600">${analysisResult.analysis.total_deposits?.toFixed(2) ?? '0.00'}</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ArrowDownIcon className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Withdrawals</p>
              <p className="text-2xl font-semibold text-red-600">${analysisResult.analysis.total_withdrawals?.toFixed(2) ?? '0.00'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Money In vs Money Out
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar options={chartOptions} data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            Your Spending Patterns
          </CardTitle>
          <CardDescription>Breakdown of your financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recurring">Recurring Transactions</TabsTrigger>
              <TabsTrigger value="key">Key Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="recurring">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {analysisResult.recurring_transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold">{transaction.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {transaction.frequency}</p>
                    </div>
                    <Badge variant={(transaction.amount ?? 0) >= 0 ? "default" : "destructive"}>
                      ${Math.abs(transaction.amount ?? 0).toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="key">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-6">
                  {Object.entries(analysisResult.key_transactions).map(([category, transactions]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-2 capitalize">{category.replace('_', ' ')}</h3>
                      {transactions?.map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.type && `${transaction.type} - `}{transaction.frequency}
                            </p>
                          </div>
                          <Badge variant={(transaction.amount ?? 0) >= 0 ? "default" : "destructive"}>
                            ${Math.abs(transaction.amount ?? 0).toFixed(2)}
                          </Badge>
                        </div>
                      )) ?? []}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
            Loan Eligibility Insight
          </CardTitle>
          <CardDescription>Based on your financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={analysisResult.loan_assessment.decision === 'APPROVED' ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Decision: {analysisResult.loan_assessment.decision}</AlertTitle>
            <AlertDescription>{analysisResult.loan_assessment.explanation}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

