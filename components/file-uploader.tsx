"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  isAnalyzing: boolean
}

export function FileUploader({ onFileUpload, isAnalyzing }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  })

  const handleUpload = () => {
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary" : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag & drop your bank statement PDF here, or click to select a file
        </p>
      </div>
      {file && (
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <span className="text-sm truncate">{file.name}</span>
          <Button onClick={handleUpload} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

