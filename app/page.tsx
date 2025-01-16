import { Metadata } from "next"
import BankStatementAnalyzer from "@/components/bank-statement-analyzer"

export const metadata: Metadata = {
  title: "Bank Statement Analyzer",
  description: "Analyze your bank statements with ease",
}

export default function Page() {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <BankStatementAnalyzer />
    </div>
  )
}

