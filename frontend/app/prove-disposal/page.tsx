"use client";

import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, ImageIcon, RefreshCw, Check, X, Leaf } from "lucide-react";
import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { supabase } from "@/components/supabase";
import { Disposal, User, UserContext } from "@/hooks/UserContext";
import { getCityFromBrowser } from "../auth/callback/page";
import { useRouter } from "next/navigation";

export default function ProveDisposalPage() {
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    valid: boolean;
    message: string;
    xpEarned: number;
  }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // compress image to 70% quality
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            setSelectedImage(compressedDataUrl);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);

    const proveDisposal = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const access_token = session?.access_token || "";

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/trash/prove_disposal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: access_token,
            image_base64: selectedImage,
          }),
        }
      );

      const data = await response.json();
      console.log("Scan result:", data);

      if (!response.ok) {
        console.error("Error analyzing image:", data);
        setResult({
          valid: false,
          message: "Error analyzing image",
          xpEarned: 0,
        });

        setIsAnalyzing(false);
        return;
      }

      if (!data.passed) {
        setResult({
          valid: false,
          message: "Not verified, " + data.reason,
          xpEarned: 0,
        });
        setIsAnalyzing(false);
        return;
      }

      // update user Supabase exp and check level and total_disposal
      let newLevel;
      let newExp;
      if (user) {
        const { data: userData } = await supabase
          .from("user")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("User data HEHE:", userData);

        if (userData) {
          const requiredExp = userData.level * 100;
          const totalExp = userData.exp + 100;

          let newLevel = userData.level;
          let newExp = totalExp;

          if (totalExp >= requiredExp) {
            newLevel += 1;
            newExp = totalExp - requiredExp;
          }

          await supabase
            .from("user")
            .update({
              exp: newExp,
              level: newLevel,
              total_disposal: userData.total_disposal + 1,
            })
            .eq("id", user.id);
        }
      }

      // add disposal to Supabase with timestampz
      // disposal only store 3 disposal per user
      // so if disposal > 3, delete the oldest disposal
      // then insert the new disposal
      // if disposal <= 3, just insert the new disposal
      const { data: disposals } = await supabase
        .from("disposal")
        .select("*")
        .eq("user_id", user?.id);

      if (disposals && disposals.length >= 3) {
        const oldestDisposal = disposals.reduce((prev, curr) => {
          return new Date(prev.datetime) < new Date(curr.datetime)
            ? prev
            : curr;
        });

        await supabase.from("disposal").delete().eq("id", oldestDisposal.id);
      }

      await supabase.from("disposal").insert({
        user_id: user?.id,
        datetime: new Date().toISOString(),
        category: data.category,
        sub_category: data.sub_category,
      });

      setResult({
        valid: true,
        message: "Verified, " + data.reason,
        xpEarned: 100,
      });

      // update user context
      const newUserData: User = {
        ...user!,
        exp: newExp!,
        level: newLevel!,
        total_disposal: user!.total_disposal + 1,
      };

      setUser(newUserData);

      setIsAnalyzing(false);
    };

    proveDisposal();
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-xl relative">
        <div className="leaf leaf-2">
          <Leaf className="h-10 w-10 text-primary/30 animate-float" />
        </div>
        <div className="leaf leaf-3">
          <Leaf
            className="h-8 w-8 text-primary/20 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <Card className="border-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Prove Disposal
            </CardTitle>
            <CardDescription>
              Upload a photo of your properly disposed waste
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload a photo of your properly disposed waste
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="scan-result">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p className="font-medium">Verifying your disposal...</p>
                  <p className="text-sm text-muted-foreground">
                    Using AI to check proper recycling
                  </p>
                </div>
              )}

              {result && !isAnalyzing && (
                <div className="scan-result">
                  <div
                    className={`scan-result-icon ${
                      result.valid
                        ? "scan-result-recyclable"
                        : "scan-result-non-recyclable"
                    }`}
                  >
                    {result.valid ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      <X className="h-8 w-8" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-center">
                    {result.valid ? "Success!" : "Not Verified"}
                  </h3>

                  <div className="scan-result-message">
                    <p>{result.message}</p>
                  </div>

                  {result.valid && (
                    <p className="text-primary font-bold">
                      +{result.xpEarned} EXP earned!
                    </p>
                  )}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </CardContent>
          <CardFooter className="flex gap-2 p-4">
            {!selectedImage ? (
              <Button className="flex-1" onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
            ) : !result ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetUpload}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Analyzing
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
  );
}
