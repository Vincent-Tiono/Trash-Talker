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
import { Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { supabase } from "../../components/supabase";

export default function LoginPage() {
  const { theme } = useTheme();

  const handleGoogleLogin = async () => {
    // In a real app, you would authenticate with Google via Supabase here
    console.log("Logging in with Google");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-pattern relative">
      <div className="leaf leaf-1">
        <Leaf className="h-12 w-12 text-primary/30 animate-float" />
      </div>
      <div className="leaf leaf-2">
        <Leaf
          className="h-16 w-16 text-primary/20 animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src={theme == "dark" ? "/default_dark.png" : "/default.png"}
              alt="Logo"
              width={300}
              height={300}
            />
          </Link>
          <p className="text-muted-foreground mt-2">The sassy recycling app</p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to TrashTalker</CardTitle>
            <CardDescription>
              Sign in to continue your recycling journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Sign in with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              type="button"
              onClick={handleGoogleLogin}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0" onClick={handleGoogleLogin}>
              Sign up with Google
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
