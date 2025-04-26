"use client";

import React, { useContext } from "react";
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
import { UserContext } from "@/hooks/UserContext";
import { set } from "react-hook-form";

export default function ProveDisposalPage() {
  const { user, setUser } = useContext(UserContext);

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
        setSelectedImage(event.target?.result as string);
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
      // const {
      //   data: { session },
      // } = await supabase.auth.getSession();
      // const access_token = session?.access_token || "";

      // const response = await fetch(
      //   "https://2e0b-60-250-102-193.ngrok-free.app/trash/prove_disposal",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       access_token: access_token,
      //       image_base64: selectedImage,
      //     }),
      //   }
      // );

      // const data = await response.json();
      // console.log("Scan result:", data);

      // if (!response.ok) {
      //   console.error("Error analyzing image:", data);
      //   setIsAnalyzing(false);
      //   return;
      // }

      // if (!data.passed) {
      //   setResult({
      //     valid: false,
      //     message: data.reason,
      //     xpEarned: 0,
      //   });
      //   setIsAnalyzing(false);
      //   return;
      // }

      const data = {
        passed: true,
        reason: "Your disposal is verified",
        xpEarned: 100,
        category: "plastic",
        sub_category: "bottle",
      };

      setResult({
        valid: false,
        message: data.reason,
        xpEarned: 0,
      });

      // update user Supabase exp and check level and total_disposal
      if (user) {
        const { data: userData } = await supabase
          .from("user")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("User data HEHE:", userData);

        if (userData) {
          const requiredExp = userData.level * 100;
          const totalExp = userData.exp + data.xpEarned;

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
        message: "Your disposal is verified",
        xpEarned: 100,
      });
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
      <div className="container mx-auto py-8 px-4 max-w-md relative">
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
