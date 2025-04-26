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
import { Disposal, User, UserContext } from "@/hooks/UserContext";
import { useRouter } from "next/navigation";
import { getCityFromBrowser } from "../auth/callback/page";

export default function ScanTrashPage() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const initUser = async () => {
      if (user) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      console.log("Session:", session);

      const userSession = session.user;
      const region = await getCityFromBrowser();

      const { data: existingUser } = await supabase
        .from("user")
        .select("*")
        .eq("email", userSession.email)
        .single();

      const { data: topUsersRegion } = await supabase
        .from("user")
        .select("*")
        .ilike("region", region)
        .order("level", { ascending: false })
        .order("exp", { ascending: false })
        .limit(10);

      const { data: topUsersGlobal } = await supabase
        .from("user")
        .select("*")
        .order("level", { ascending: false })
        .order("exp", { ascending: false })
        .limit(10);

      const { data: disposals } = await supabase
        .from("disposal")
        .select("*")
        .eq("user_id", userSession.id);

      const userData = {
        id: userSession.id,
        name: userSession.user_metadata.name,
        email: userSession.email,
        image: userSession.user_metadata.avatar_url,
        region,
        exp: existingUser?.exp || 0,
        level: existingUser?.level || 1,
        total_disposal: existingUser?.total_disposal || 0,
        topUsersRegion: topUsersRegion || [],
        topUsersGlobal: topUsersGlobal || [],
        disposals: (disposals as Disposal[]) || [],
      };

      setUser(userData as User);

      if (!existingUser) {
        await supabase.from("user").insert(userData);
      }
    };

    initUser();
  }, []);

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<null | {
    category: string;
    sub_category: string;
    recyclable?: boolean;
    xpEarned: number;
  }>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const streamUrl = "http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg";

  const captureImage = () => {
    try {
      if (imgRef.current) {
        const img = imgRef.current;

        // Temporarily remove the image source URL to freeze the current frame
        const currentSrc = img.src;
        img.src = ""; // This removes the MJPEG stream, freezing the frame

        // Set anonymous image to avoid CORS issues
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Draw the frozen frame onto the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert canvas content to base64 (image/jpeg format)
          const imageBase64 = canvas.toDataURL("image/jpeg");
          console.log("Captured image base64:", imageBase64);

          // Set the captured image to the base64 string
          setCapturedImage(imageBase64);

          // Proceed to analyze the captured image
          analyzeImage(imageBase64);
        }

        // Restore the original MJPEG stream URL to allow further captures
        img.src = currentSrc;

        setIsCapturing(false);
      }
    } catch (err) {
      console.error("Error capturing image:", err);
    }
  };

  const analyzeImage = (imageUrl: string) => {
    setIsAnalyzing(true);

    const scanTrash = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const access_token = session?.access_token || "";

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/trash/scan_trash",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token, image_base64: imageUrl }),
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
      <div className="container mx-auto py-8 px-4 max-w-xl relative">
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
                        : "scan-result-non-recyclable"
                    }`}
                  >
                    {result.category === "recyclable" ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      <X className="h-8 w-8" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-1">
                    {result.sub_category}
                  </h3>
                  <p className="text-lg mb-4">{result.category}</p>

                  <div className="scan-result-message">
                    {result.category === "recyclable"
                      ? "♻️ This item is recyclable."
                      : "❌ This item is non-recyclable."}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.category === "recyclable"
                        ? "Place this item in the recycling bin"
                        : "This should go in the non-recyclable waste bin"}
                    </p>
                    <p className="text-primary font-bold">
                      Remember to throw it in the right bin!
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
