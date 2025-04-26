"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, RefreshCw, Check, X, Leaf } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";

export default function ScanTrashPage() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<null | {
    name: string;
    type: string;
    recyclable: boolean;
    xpEarned: number;
  }>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCapturing) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCapturing]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        setIsCapturing(false);
        analyzeImage(imageDataUrl);
      }
    }
  };

  const analyzeImage = (imageUrl: string) => {
    setIsAnalyzing(true);

    // Simulate API call to AWS Bedrock for image analysis
    setTimeout(() => {
      // Mock result - in a real app, this would come from AWS Bedrock
      const mockResults = [
        {
          name: "Plastic Bottle",
          type: "Plastic",
          recyclable: true,
          xpEarned: 50,
        },
        {
          name: "Banana Peel",
          type: "Organic",
          recyclable: true,
          xpEarned: 30,
        },
        {
          name: "Styrofoam Cup",
          type: "Polystyrene",
          recyclable: false,
          xpEarned: 20,
        },
        {
          name: "Cardboard Box",
          type: "Paper",
          recyclable: true,
          xpEarned: 40,
        },
      ];

      // Select a random result
      const randomResult =
        mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetScan = () => {
    setCapturedImage(null);
    setResult(null);
    setIsCapturing(true);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-md relative">
        <div className="leaf leaf-1">
          <Leaf className="h-8 w-8 text-primary/30 animate-float" />
        </div>
        <div className="leaf leaf-4">
          <Leaf
            className="h-10 w-10 text-primary/20 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <Card className="border-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" /> Scan Trash
            </CardTitle>
            <CardDescription>
              Point your camera at an item to identify it
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
              {isCapturing ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button className="camera-button" onClick={captureImage}>
                    <span className="sr-only">Capture</span>
                    <div className="camera-button-inner"></div>
                  </button>
                </>
              ) : capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Click "Start Camera" to begin scanning
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="scan-result">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p className="font-medium">Analyzing your trash...</p>
                  <p className="text-sm text-muted-foreground">
                    Using AI to identify the item
                  </p>
                </div>
              )}

              {result && !isAnalyzing && (
                <div className="scan-result">
                  <div
                    className={`scan-result-icon ${
                      result.recyclable
                        ? "scan-result-recyclable"
                        : "scan-result-non-recyclable"
                    }`}
                  >
                    {result.recyclable ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      <X className="h-8 w-8" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-1">{result.name}</h3>
                  <p className="text-lg mb-4">{result.type}</p>

                  <div className="scan-result-message">
                    {result.recyclable
                      ? "♻️ This item is recyclable!"
                      : "❌ This item is NOT recyclable"}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.recyclable
                        ? "Place this item in the recycling bin"
                        : "This should go in general waste"}
                    </p>
                    <p className="text-primary font-bold">
                      +{result.xpEarned} XP earned!
                    </p>
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
          <CardFooter className="flex gap-2 p-4">
            {!isCapturing ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCapturing(true)}
                >
                  {capturedImage ? "Retake" : "Start Camera"}
                </Button>
                {result && (
                  <Button className="flex-1" onClick={resetScan}>
                    Scan Another
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsCapturing(false)}
              >
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
