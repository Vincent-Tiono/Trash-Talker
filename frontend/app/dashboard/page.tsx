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
import Image from "next/image";
import { JSX, ReactNode, useContext, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Disposal, User, UserContext } from "@/hooks/UserContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/components/supabase";
import { getCityFromBrowser } from "../auth/callback/page";

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

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

  console.log("User data:", user);

  const userName = user?.name || "User";
  const userImage = user?.image || "/default.png";
  const userRegion = user?.region || "Unknown Region";
  const userEmail = user?.email || "";
  const level = user?.level || 1;
  const exp = user?.exp || 0;
  const totalDisposal = user?.total_disposal || 0;

  const nextLevelExp = 100 * level;
  let badge = "";
  let nextBadge = "";
  let nextBadgeLevel = 0;
  if (level < 5) {
    badge = "Real Trash";
    nextBadge = "Trash Trainee";
    nextBadgeLevel = 5;
  } else if (level < 10) {
    badge = "Trash Trainee";
    nextBadge = "Bin Boss";
    nextBadgeLevel = 10;
  } else if (level < 15) {
    badge = "Bin Boss";
    nextBadge = "Garbage Guru";
    nextBadgeLevel = 15;
  } else if (level < 20) {
    badge = "Garbage Guru";
    nextBadge = "Lord of the Litter";
    nextBadgeLevel = 20;
  } else {
    badge = "Lord of the Litter";
    nextBadge = "Maxed Out!";
    nextBadgeLevel = 20;
  }
  const topUsersRegion = user?.topUsersRegion || [];

  const recentActivity = user?.disposals || [];

  // const [recentActivity, setRecentActivity] = useState([
  //   {
  //     id: 1,
  //     type: "Plastic Bottle",
  //     category: "Recyclable",
  //     points: 50,
  //     date: "Today, 2:30 PM",
  //   },
  //   {
  //     id: 2,
  //     type: "Banana Peel",
  //     category: "Organic",
  //     points: 30,
  //     date: "Today, 11:15 AM",
  //   },
  //   {
  //     id: 3,
  //     type: "Cardboard Box",
  //     category: "Recyclable",
  //     points: 70,
  //     date: "Yesterday, 4:45 PM",
  //   },
  // ]);

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
            Welcome back, {userName}!
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
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-teal-700">
                      <Image
                        src={userImage}
                        alt="User Image"
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-background">
                      {level}
                    </div>
                  </div>
                  <h3 className="font-fredoka text-xl font-bold mb-1">
                    {userName}
                  </h3>
                  <h3 className="font-fredoka text-xs text-muted-foreground mb-5">
                    {userEmail}
                  </h3>
                  <p className="text-muted-foreground">
                    Level {level} ({badge})
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="progress-label">
                      <span>EXP Progress</span>
                      <span>
                        {exp} / {nextLevelExp}
                      </span>
                    </div>
                    <Progress
                      value={(exp / nextLevelExp) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="dashboard-stat">
                      <p className="dashboard-stat-value font-fredoka">
                        {totalDisposal}
                      </p>
                      <p className="dashboard-stat-label">Total Disposal</p>
                    </div>
                    <div className="dashboard-stat">
                      <p className="dashboard-stat-value font-fredoka">{exp}</p>
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
                        <p className="font-medium">{nextBadge}</p>
                        <p className="text-xs text-muted-foreground">
                          Reach Level {nextBadgeLevel} to unlock
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
                <CardDescription>Top recyclers, {userRegion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsersRegion && topUsersRegion.length > 0 ? (
                    topUsersRegion.map((user, index) => (
                      <div
                        key={user.id || index}
                        className="leaderboard-item flex items-center gap-3 bg-primary/5 hover:bg-primary/10 p-3 rounded-lg transition-colors"
                      >
                        <div className="leaderboard-rank flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>

                        <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-background flex-shrink-0">
                          <Image
                            src={user.image || "/default.png"}
                            alt={`${user.name}'s profile`}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="leaderboard-user-name font-medium truncate">
                            {user.name}
                          </p>
                          <p className="leaderboard-user-stats text-xs text-muted-foreground truncate">
                            Level {user.level} ({user.exp} EXP)
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-3">
                        <Award className="h-6 w-6 text-muted-foreground/60" />
                      </div>
                      <h3 className="text-sm font-medium mb-1">
                        No leaderboard data
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Start recycling to see rankings
                      </p>
                    </div>
                  )}

                  <Link
                    href="/leaderboard"
                    className="flex items-center justify-center text-sm text-primary hover:underline mt-2"
                  >
                    View full leaderboard
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
                      Submit proof of proper disposal to earn EXP and level up
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
                  {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
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
                            <p className="activity-title">
                              {activity.sub_category}
                            </p>
                            <p className="activity-points">+100 EXP</p>
                          </div>
                          <div className="activity-footer">
                            <p>{activity.category}</p>
                            <p className="activity-date">
                              {(() => {
                                const now = new Date();
                                const date = new Date(activity.datetime);

                                const isToday =
                                  now.toDateString() === date.toDateString();
                                const yesterday = new Date();
                                yesterday.setDate(now.getDate() - 1);
                                const isYesterday =
                                  yesterday.toDateString() ===
                                  date.toDateString();

                                const timeString = date.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false, // if you prefer 24h format; remove if want AM/PM
                                  }
                                );

                                if (isToday) return `Today, ${timeString}`;
                                if (isYesterday)
                                  return `Yesterday, ${timeString}`;

                                return date.toLocaleString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                });
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                        <Trash2 className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        No activity yet
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Start scanning trash to see your activity here
                      </p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/scan-trash">Start Scanning</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Recyclo-Rumble Progress</CardTitle>
                <CardDescription>
                  Your journey to becoming a recycling champion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[15px] w-[2px] bg-muted" />

                  {[
                    {
                      levelReq: 1,
                      title: "Real Trash",
                      subtitle: "Level 1 • Starting your journey",
                    },
                    {
                      levelReq: 5,
                      title: "♻️ Trash Trainee",
                      subtitle: "Level 5 • Learning the basics",
                    },
                    {
                      levelReq: 10,
                      title: "🚮 Bin Boss",
                      subtitle: "Level 10 • Master of the bins",
                    },
                    {
                      levelReq: 15,
                      title: "🧹 Garbage Guru",
                      subtitle: "Level 15 • Master the art of recycling",
                    },
                    {
                      levelReq: 20,
                      title: "👑 Lord of the Litter",
                      subtitle: "Level 20+ • The ultimate recycling champion",
                    },
                  ].map((item, idx, arr) => {
                    const nextLevelReq = arr[idx + 1]?.levelReq ?? Infinity;
                    const isAchieved = level >= item.levelReq;
                    const isCurrent =
                      level >= item.levelReq && level < nextLevelReq;

                    return (
                      <div className="timeline-item" key={item.levelReq}>
                        <div
                          className={`timeline-marker ${
                            isCurrent
                              ? "bg-primary border-2 border-teal-100" // current -> special highlight
                              : isAchieved
                              ? "bg-primary"
                              : "bg-muted/50"
                          }`}
                        >
                          {isAchieved && !isCurrent && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="timeline-content">
                          <h3
                            className={`timeline-title ${
                              !isAchieved ? "text-muted-foreground" : ""
                            } ${isCurrent ? "font-bold text-primary" : ""}`}
                          >
                            {item.title}
                          </h3>
                          <p className="timeline-subtitle">{item.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
function UseContext(
  UserProvider: ({ children }: { children: ReactNode }) => JSX.Element
): { user: any } {
  throw new Error("Function not implemented.");
}
