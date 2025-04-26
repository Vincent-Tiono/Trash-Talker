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
  const [isPaused, setIsPaused] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const streamUrl = "http://192.168.0.100:5000/fe/mjpeg_stream?";

  useEffect(() => {
    if (!isCapturing) {
      pauseCamera();
    }
    return () => {
      playCamera();
    };
  }, []);

  const playCamera = async () => {
    try {
      await fetch("http://192.168.0.100:5000/camera/play", { method: "POST" });
      setIsPaused(false);
    } catch (err) {
      console.error("Error playing camera:", err);
    }
  };

  const pauseCamera = async () => {
    try {
      await fetch("http://192.168.0.100:5000/camera/pause", { method: "POST" });
      setIsPaused(true);
    } catch (err) {
      console.error("Error pausing camera:", err);
    }
  };

  const captureImage = async () => {
    try {
      await pauseCamera();
      if (imgRef.current) {
        const img = imgRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setCapturedImage(imageBase64);
          analyzeImage(imageBase64);
        }
      }
      setIsCapturing(false);
    } catch (err) {
      console.error("Error capturing image:", err);
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
    playCamera();
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
                  <img
                    ref={imgRef}
                    src={streamUrl}
                    alt="Camera Stream"
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
                      Remember to recycle responsibly!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 p-4">
            {!isCapturing ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsCapturing(true);
                    playCamera();
                  }}
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
                onClick={() => {
                  setIsCapturing(false);
                  pauseCamera();
                }}
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
