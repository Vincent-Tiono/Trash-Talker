"use client";
import { Button } from "@/components/ui/button";
import {
  Recycle,
  Camera,
  Trophy,
  LogIn,
  ArrowRight,
  CheckCircle,
  Award,
  BarChart3,
  Leaf,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Image
              src={theme == "dark" ? "/default_dark.png" : "/default.png"}
              alt="Logo"
              width={220}
              height={220}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-pattern relative overflow-hidden py-20 md:py-32">
        <div className="leaf leaf-1">
          <Leaf className="h-12 w-12 text-primary/30 animate-float" />
        </div>
        <div className="leaf leaf-2">
          <Leaf
            className="h-16 w-16 text-primary/20 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="leaf leaf-3">
          <Leaf
            className="h-10 w-10 text-primary/30 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="leaf leaf-3">
          <Leaf
            className="h-10 w-10 text-primary/30 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
        <div className="leaf leaf-4">
          <Leaf
            className="h-14 w-14 text-primary/20 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
                Eco-friendly
              </div>
              <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary mx-3">
                Gamified
              </div>
              <h1 className="font-fredoka text-4xl md:text-6xl font-bold tracking-tight">
                Save Environment,{" "}
                <span className="bg-gradient-to-r from-green-400 to-teal-800 bg-clip-text text-transparent">
                  Recycle Smarter.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-gray-600">
                Utilize AI to identify waste and guide proper disposal through
                gamification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-700 text-md"
                  >
                    <LogIn className="mr-2 h-6 w-6" /> Get Started
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-md"
                  >
                    <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute bg-gradient-to-r from-primary to-green-400 rounded-2xl blur opacity"></div>
              <div className="relative bg-card rounded-2xl overflow-hidden border shadow-xl">
                <div className="aspect-[4/3] flex items-center justify-center p-8">
                  <div className="text-center">
                    <Recycle className="h-24 w-24 mx-auto mb-6 text-primary animate-float" />
                    <h2 className="font-fredoka text-2xl font-bold mb-2">
                      Scan. Recycle. Earn.
                    </h2>
                    <p className="text-muted-foreground">
                      Join the Recyclo-Rumble™ today!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
          <button className="animate-bounce rounded-full bg-background p-2 shadow-md">
            <ChevronDown className="h-6 w-6 text-primary" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary mb-4">
              Simple Process
            </div>
            <h2 className="font-fredoka text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trashtalker makes recycling simple, educational, and rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="feature-icon">
                <Camera className="h-8 w-8 ms-4" />
              </div>
              <h3 className="font-fredoka text-xl font-bold mb-2">
                Scan Trash
              </h3>
              <p className="text-muted-foreground mb-4">
                Use your camera to identify waste and learn how to dispose of it
                properly.
              </p>
              <div className="text-primary font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircle className="h-8 w-8 ms-4" />
              </div>
              <h3 className="font-fredoka text-xl font-bold mb-2">
                Prove Disposal
              </h3>
              <p className="text-muted-foreground mb-4">
                Submit proof of proper disposal to earn XP and level up your
                recycling game.
              </p>
              <div className="text-primary font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Trophy className="h-8 w-8 ms-4" />
              </div>
              <h3 className="font-fredoka text-xl font-bold mb-2">
                Climb the Ranks
              </h3>
              <p className="text-muted-foreground mb-4">
                Compete with friends and earn badges as you become a recycling
                champion.
              </p>
              <div className="text-primary font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stats-item">
              <p className="font-fredoka stats-value">127K+</p>
              <p className="stats-label">Items Recycled</p>
            </div>
            <div className="stats-item">
              <p className="font-fredoka stats-value">15K+</p>
              <p className="stats-label">Active Users</p>
            </div>
            <div className="stats-item">
              <p className="font-fredoka stats-value">4.2M</p>
              <p className="stats-label">XP Earned</p>
            </div>
            <div className="stats-item">
              <p className="font-fredoka stats-value">8.5K</p>
              <p className="stats-label">Badges Awarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Achievements
            </div>
            <h2 className="font-fredoka text-4xl font-bold mb-4">
              Earn Badges & Level Up
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Collect digital badges that prove your commitment to saving the
              planet
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Trash Trainee",
                level: 1,
                icon: <Recycle className="m-auto" />,
              },
              {
                name: "Bin Boss",
                level: 5,
                icon: <Award className="m-auto" />,
              },
              {
                name: "Garbage Guru",
                level: 10,
                icon: <Trophy className="m-auto" />,
              },
              {
                name: "Lord of the Litter",
                level: 20,
                icon: <BarChart3 className="m-auto" />,
              },
            ].map((badge, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="badge-circle mb-4 animate-pulse"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="text-white">
                    {badge.icon}
                    <span className="text-xs font-bold block mt-1">
                      LVL {badge.level}
                    </span>
                  </div>
                </div>
                <h3 className="font-fredoka text-center font-bold">
                  {badge.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary mb-4">
              Testimonials
            </div>
            <h2 className="font-fredoka text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of eco-warriors in the Recyclo-Rumble™
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <p className="mb-4">
                "Trashtalker has completely changed how I think about recycling.
                The gamification makes it fun, and I've learned so much about
                proper waste disposal!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">JD</span>
                </div>
                <div>
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">
                    Level 12 Eco Warrior
                  </p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="mb-4">
                "I love competing with my friends to see who can recycle more.
                The badges are a great motivation, and the AI identification is
                surprisingly accurate!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">JS</span>
                </div>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">
                    Level 8 Bin Boss
                  </p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="mb-4">
                "As a parent, I appreciate how Trashtalker makes recycling
                educational for my kids. They're excited to scan items and earn
                points while learning about sustainability."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">AT</span>
                </div>
                <div>
                  <p className="font-medium">Alex Taylor</p>
                  <p className="text-xs text-muted-foreground">
                    Level 15 Garbage Guru
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary mb-4">
              App Preview
            </div>
            <h2 className="font-fredoka text-4xl font-bold mb-4">
              See Trashtalker in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the features that make recycling fun and rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-green-400 rounded-2xl blur opacity-10"></div>
              <div className="relative bg-card rounded-2xl overflow-hidden border shadow-lg">
                <div className="aspect-[9/16] bg-muted flex items-center justify-center p-4">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-fredoka text-xl font-bold">
                      Scan Trash
                    </h3>
                    <p className="text-md text-muted-foreground">
                      Identify items with AI
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-green-400 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-card rounded-2xl overflow-hidden border shadow-lg">
                <div className="aspect-[9/16] bg-muted flex items-center justify-center p-4">
                  <div className="text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-fredoka text-xl font-bold">
                      Leaderboard
                    </h3>
                    <p className="text-md text-muted-foreground">
                      Compete with friends
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-green-400 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-card rounded-2xl overflow-hidden border shadow-lg">
                <div className="aspect-[9/16] bg-muted flex items-center justify-center p-4">
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-fredoka text-xl font-bold">
                      Earn Badges
                    </h3>
                    <p className="text-md text-muted-foreground">
                      Collect achievements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-fredoka text-4xl font-bold mb-4">
            Ready to Save the Planet?
          </h2>
          <p className="text-xl font-semibold mb-8 text-white/80">
            Join thousands of eco-warriors in the Recyclo-Rumble™
          </p>
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="animate-pulse text-lg"
            >
              Start Recycling Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image
                src={theme == "dark" ? "/default_dark.png" : "/default.png"}
                alt="Logo"
                width={180}
                height={180}
                className="rounded-full"
              />
            </div>
            <div className="flex gap-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Terms
              </Link>
            </div>
          </div>
          <div className="border-t mt-6 pt-6 text-center text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Trashtalker. All rights reserved.
            </p>
            <p className="text-sm mt-2">Made with 💚 for the planet</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
