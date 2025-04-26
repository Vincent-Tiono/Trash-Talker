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
import { useState, useRef, useEffect, useContext } from "react";
import { Navbar } from "@/components/navbar";
import { supabase } from "@/components/supabase";
import { UserContext } from "@/hooks/UserContext";

export default function ScanTrashPage() {
  const { user, setUser } = useContext(UserContext);

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<null | {
    category: string;
    sub_category: string;
    recyclable?: boolean;
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

        // Compress the image (optional: change the scale or quality)
        const compressedImage = canvasRef.current.toDataURL("image/jpeg", 0.7); // 0.7 is the quality (70%)

        console.log(compressedImage);

        // Set the compressed image and initiate analysis
        setCapturedImage(compressedImage);
        setIsCapturing(false);
        analyzeImage(compressedImage);
      }
    }
  };

  const analyzeImage = (imageUrl: string) => {
    setIsAnalyzing(true);

    const scanTrash = async () => {
      const response = await fetch(
        "https://2e0b-60-250-102-193.ngrok-free.app/trash/scan_trash",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: "", image_base64: imageUrl }),
        }
      );

      const data = await response.json();
      console.log("Scan result:", data);

      if (!response.ok) {
        console.error("Error analyzing image:", data);
        setIsAnalyzing(false);
        return;
      }

      setResult(data);
      setIsAnalyzing(false);
    };

    scanTrash();
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
                      result.category === "recyclable"
                        ? "scan-result-recyclable"
                        : result.category === "general waste"
                        ? "scan-result-general-waste"
                        : "scan-result-organic"
                    }`}
                  >
                    {result.category === "recyclable" ? (
                      <Check className="h-8 w-8" />
                    ) : result.category === "general waste" ? (
                      <X className="h-8 w-8" />
                    ) : (
                      <Leaf className="h-8 w-8" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-1">
                    {result.sub_category}
                  </h3>
                  <p className="text-lg mb-4">{result.category}</p>

                  <div className="scan-result-message">
                    {result.category === "recyclable"
                      ? "♻️ This item is recyclable!"
                      : result.category === "general waste"
                      ? "❌ This item is general waste"
                      : "🌱 This item is organic"}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.category === "recyclable"
                        ? "Place this item in the recycling bin"
                        : result.category === "general waste"
                        ? "This should go in general waste"
                        : "This should go in the organic waste bin"}
                    </p>
                    <p className="text-primary font-bold">
                      +{result.xpEarned} 100 EXP earned!
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
