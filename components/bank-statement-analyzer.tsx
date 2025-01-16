"use client"

import { useState } from "react"
import { FileUploader } from "./file-uploader"
import { Dashboard } from "./dashboard"
import { ModeToggle } from "./mode-toggle"
import API_CONFIG from "@/config/api"

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


export default function BankStatementAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analyze}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysisResult(data)
      setAnalysisComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAnalysisComplete(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-4 rounded-lg shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Bank Statement Analyzer
            <span className="block text-lg font-medium mt-2">Financial Insights: For Loan Recommendation</span>
          </h1>
          <ModeToggle />
        </div>
      </header>

      {!analysisComplete && (
        <FileUploader onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
      )}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Note: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {analysisComplete && analysisResult && (
        <Dashboard analysisResult={analysisResult} />
      )}
    </div>
  )
}

