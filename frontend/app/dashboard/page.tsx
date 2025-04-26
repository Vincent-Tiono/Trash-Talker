"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Upload,
  Award,
  ArrowRight,
  Leaf,
  ChevronRight,
  Recycle,
  Trash2,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/navbar";

export default function Dashboard() {
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(2500);
  const [nextLevelXp, setNextLevelXp] = useState(3000);
  const [badge, setBadge] = useState("Bin Boss");
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "Plastic Bottle",
      category: "Recyclable",
      points: 50,
      date: "Today, 2:30 PM",
    },
    {
      id: 2,
      type: "Banana Peel",
      category: "Organic",
      points: 30,
      date: "Today, 11:15 AM",
    },
    {
      id: 3,
      type: "Cardboard Box",
      category: "Recyclable",
      points: 70,
      date: "Yesterday, 4:45 PM",
    },
  ]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 relative">
        <div className="leaf leaf-1">
          <Leaf className="h-12 w-12 text-primary/20 animate-float" />
        </div>
        <div className="leaf leaf-4">
          <Leaf
            className="h-10 w-10 text-primary/20 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="mb-8">
          <h1 className="font-fredoka text-3xl font-bold mb-2">
            Welcome back, Eco Warrior!
          </h1>
          <p className="text-muted-foreground">
            Track your recycling progress and earn rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile & Stats */}
          <div className="space-y-6">
            <Card className="dashboard-card overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-primary to-green-400"></div>
              <CardHeader className="pb-2">
                <CardTitle className="font-fredoka">Your Profile</CardTitle>
                <CardDescription>Your recycling journey stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-background">
                      {level}
                    </div>
                  </div>
                  <h3 className="font-fredoka text-xl font-bold mb-1">
                    Eco Warrior
                  </h3>
                  <p className="text-muted-foreground">
                    Level {level} • {badge}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="progress-label">
                      <span>XP Progress</span>
                      <span>
                        {xp} / {nextLevelXp}
                      </span>
                    </div>
                    <Progress
                      value={(xp / nextLevelXp) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="dashboard-stat">
                      <p className="dashboard-stat-value font-fredoka">127</p>
                      <p className="dashboard-stat-label">Items Recycled</p>
                    </div>
                    <div className="dashboard-stat">
                      <p className="dashboard-stat-value font-fredoka">4,350</p>
                      <p className="dashboard-stat-label">Total XP</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Next Badge</h4>
                    <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Garbage Guru</p>
                        <p className="text-xs text-muted-foreground">
                          Reach Level 10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-primary to-green-400"></div>
              <CardHeader className="pb-2">
                <CardTitle className="font-fredoka">Leaderboard</CardTitle>
                <CardDescription>Top recyclers this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="leaderboard-item bg-primary/5">
                    <div className="leaderboard-rank bg-primary text-white">
                      1
                    </div>
                    <div className="leaderboard-user">
                      <p className="leaderboard-user-name">EcoNinja</p>
                      <div className="leaderboard-user-stats">
                        <p>Level 12 • 7,890 XP</p>
                      </div>
                    </div>
                  </div>

                  <div className="leaderboard-item">
                    <div className="leaderboard-rank bg-muted">2</div>
                    <div className="leaderboard-user">
                      <p className="leaderboard-user-name">RecycleQueen</p>
                      <div className="leaderboard-user-stats">
                        <p>Level 10 • 6,240 XP</p>
                      </div>
                    </div>
                  </div>

                  <div className="leaderboard-item">
                    <div className="leaderboard-rank bg-muted">3</div>
                    <div className="leaderboard-user">
                      <p className="leaderboard-user-name">GreenGuru</p>
                      <div className="leaderboard-user-stats">
                        <p>Level 9 • 5,780 XP</p>
                      </div>
                    </div>
                  </div>

                  <div className="leaderboard-item bg-muted/30">
                    <div className="leaderboard-rank bg-muted">8</div>
                    <div className="leaderboard-user">
                      <p className="leaderboard-user-name">You</p>
                      <div className="leaderboard-user-stats">
                        <p>Level 5 • 2,500 XP</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/leaderboard"
                    className="flex items-center justify-center text-sm text-primary hover:underline mt-2"
                  >
                    View full leaderboard{" "}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Main Actions */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/scan-trash">
                <Card className="h-full dashboard-card cursor-pointer overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-primary to-green-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-fredoka text-xl font-bold mb-2">
                      Scan Trash
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Use your camera to identify waste and learn how to dispose
                      of it properly
                    </p>
                    <Button className="w-full group-hover:bg-primary/90 transition-colors mx-auto flex justify-center">
                      Start Scanning{" "}
                      <ChevronRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/prove-disposal">
                <Card className="h-full dashboard-card cursor-pointer overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-primary to-green-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-fredoka text-xl font-bold mb-2">
                      Prove Disposal
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Submit proof of proper disposal to earn XP and level up
                      your recycling game
                    </p>
                    <Button className="w-full group-hover:bg-primary/90 transition-colors mx-auto flex justify-center">
                      Upload Proof{" "}
                      <ChevronRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest recycling achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.category === "Recyclable" ? (
                          <Recycle className="h-5 w-5" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </div>
                      <div className="activity-content">
                        <div className="activity-header">
                          <p className="activity-title">{activity.type}</p>
                          <p className="activity-points">
                            +{activity.points} XP
                          </p>
                        </div>
                        <div className="activity-footer">
                          <p>{activity.category}</p>
                          <p>{activity.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Recyclo-Rumble™ Progress</CardTitle>
                <CardDescription>
                  Your journey to becoming a recycling champion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[15px] w-[2px] bg-muted" />

                  <div className="timeline-item">
                    <div className="timeline-marker bg-muted">
                      <div className="timeline-marker-inner bg-primary" />
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title">Real Trash</h3>
                      <p className="timeline-subtitle">
                        Level 0 • Starting your journey
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker bg-muted">
                      <div className="timeline-marker-inner bg-primary" />
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title">♻️ Trash Trainee</h3>
                      <p className="timeline-subtitle">
                        Level 1 • Learning the basics
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker bg-primary">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title">🚮 Bin Boss</h3>
                      <p className="timeline-subtitle">
                        Level 5 • Current Level
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker bg-muted/50">
                      <div className="timeline-marker-inner bg-muted" />
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title text-muted-foreground">
                        🧹 Garbage Guru
                      </h3>
                      <p className="timeline-subtitle">
                        Level 10 • Master the art of recycling
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker bg-muted/50">
                      <div className="timeline-marker-inner bg-muted" />
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title text-muted-foreground">
                        👑 Lord of the Litter
                      </h3>
                      <p className="timeline-subtitle">
                        Level 20+ • The ultimate recycling champion
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
