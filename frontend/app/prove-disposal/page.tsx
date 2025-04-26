"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, RefreshCw, Check, X, Leaf } from "lucide-react"
import { useState, useRef } from "react"
import { Navbar } from "@/components/navbar"

export default function ProveDisposalPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<null | {
    valid: boolean
    message: string
    xpEarned: number
  }>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const analyzeImage = () => {
    setIsAnalyzing(true)

    // Simulate API call to AWS Bedrock for image analysis
    setTimeout(() => {
      // Mock result - in a real app, this would come from AWS Bedrock
      const mockResults = [
        {
          valid: true,
          message: "Valid recycling proof! We detected proper disposal of recyclable items.",
          xpEarned: 100,
        },
        {
          valid: false,
          message: "We couldn't verify this as proper recycling. Please ensure the recycling bin is clearly visible.",
          xpEarned: 0,
        },
      ]

      // Select a random result, with 80% chance of success
      const isSuccess = Math.random() < 0.8
      setResult(mockResults[isSuccess ? 0 : 1])
      setIsAnalyzing(false)
    }, 2000)
  }

  const resetUpload = () => {
    setSelectedImage(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-md relative">
        <div className="leaf leaf-2">
          <Leaf className="h-10 w-10 text-primary/30 animate-float" />
        </div>
        <div className="leaf leaf-3">
          <Leaf className="h-8 w-8 text-primary/20 animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <Card className="border-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Prove Disposal
            </CardTitle>
            <CardDescription>Upload a photo of your properly disposed waste</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage || "/placeholder.svg"} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Upload a photo of your properly disposed waste</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="scan-result">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p className="font-medium">Verifying your disposal...</p>
                  <p className="text-sm text-muted-foreground">Using AI to check proper recycling</p>
                </div>
              )}

              {result && !isAnalyzing && (
                <div className="scan-result">
                  <div
                    className={`scan-result-icon ${result.valid ? "scan-result-recyclable" : "scan-result-non-recyclable"}`}
                  >
                    {result.valid ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-center">{result.valid ? "Success!" : "Not Verified"}</h3>

                  <div className="scan-result-message">
                    <p>{result.message}</p>
                  </div>

                  {result.valid && <p className="text-primary font-bold">+{result.xpEarned} XP earned!</p>}
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </CardContent>
          <CardFooter className="flex gap-2 p-4">
            {!selectedImage ? (
              <Button className="flex-1" onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
            ) : !result ? (
              <>
                <Button variant="outline" className="flex-1" onClick={resetUpload}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={analyzeImage} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing
                    </>
                  ) : (
                    "Verify Disposal"
                  )}
                </Button>
              </>
            ) : (
              <Button className="flex-1" onClick={resetUpload}>
                Upload Another
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
