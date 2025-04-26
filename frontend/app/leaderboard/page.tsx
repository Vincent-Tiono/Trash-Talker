"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, User, Leaf } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/navbar";

type LeaderboardUser = {
  id: number;
  name: string;
  level: number;
  xp: number;
  badge: string;
  isCurrentUser?: boolean;
};

export default function LeaderboardPage() {
  const [globalUsers] = useState<LeaderboardUser[]>([
    {
      id: 1,
      name: "EcoNinja",
      level: 24,
      xp: 24890,
      badge: "Lord of the Litter",
    },
    {
      id: 2,
      name: "RecycleQueen",
      level: 19,
      xp: 19340,
      badge: "Garbage Guru",
    },
    { id: 3, name: "GreenGuru", level: 18, xp: 18120, badge: "Garbage Guru" },
    {
      id: 4,
      name: "WasteWarrior",
      level: 15,
      xp: 15780,
      badge: "Garbage Guru",
    },
    { id: 5, name: "TrashTitan", level: 14, xp: 14250, badge: "Garbage Guru" },
    { id: 6, name: "EcoHero", level: 12, xp: 12340, badge: "Garbage Guru" },
    {
      id: 7,
      name: "RecycleMaster",
      level: 10,
      xp: 10120,
      badge: "Garbage Guru",
    },
    {
      id: 8,
      name: "You",
      level: 5,
      xp: 5340,
      badge: "Bin Boss",
      isCurrentUser: true,
    },
    { id: 9, name: "GreenNewbie", level: 3, xp: 3120, badge: "Trash Trainee" },
    { id: 10, name: "EcoLearner", level: 2, xp: 2340, badge: "Trash Trainee" },
  ]);

  const [localUsers] = useState<LeaderboardUser[]>([
    { id: 1, name: "LocalHero", level: 15, xp: 15340, badge: "Garbage Guru" },
    {
      id: 2,
      name: "NeighborGreen",
      level: 12,
      xp: 12780,
      badge: "Garbage Guru",
    },
    {
      id: 3,
      name: "BlockRecycler",
      level: 10,
      xp: 10120,
      badge: "Garbage Guru",
    },
    {
      id: 4,
      name: "You",
      level: 5,
      xp: 5340,
      badge: "Bin Boss",
      isCurrentUser: true,
    },
    {
      id: 5,
      name: "StreetCleaner",
      level: 4,
      xp: 4250,
      badge: "Trash Trainee",
    },
  ]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-2xl relative">
        <div className="leaf leaf-1">
          <Leaf className="h-10 w-10 text-primary/20 animate-float" />
        </div>
        <div className="leaf leaf-4">
          <Leaf
            className="h-8 w-8 text-primary/20 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-primary" /> Leaderboard
          </h1>
          <p className="text-muted-foreground">
            See how you rank against other recycling champions
          </p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
                <CardDescription>
                  Top recyclers from around the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className={`leaderboard-item ${
                        user.isCurrentUser
                          ? "bg-primary/5 border-2 border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-10">
                        {index === 0 ? (
                          <Trophy className="h-8 w-8 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="h-8 w-8 text-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="h-8 w-8 text-amber-700" />
                        ) : (
                          <div className="leaderboard-rank bg-muted">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="leaderboard-user">
                        <div className="leaderboard-user-name">
                          {user.name}
                          {user.isCurrentUser && " (You)"}
                          {user.isCurrentUser && (
                            <User className="ml-1 h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="leaderboard-user-stats">
                          <p>{user.badge}</p>
                          <div className="leaderboard-user-level">
                            <Award className="h-4 w-4 text-primary" />
                            <span>Level {user.level}</span>
                            <span className="ml-1">
                              ({user.xp.toLocaleString()} XP)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local">
            <Card>
              <CardHeader>
                <CardTitle>Local Leaderboard</CardTitle>
                <CardDescription>Top recyclers in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className={`leaderboard-item ${
                        user.isCurrentUser
                          ? "bg-primary/5 border-2 border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-10">
                        {index === 0 ? (
                          <Trophy className="h-8 w-8 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="h-8 w-8 text-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="h-8 w-8 text-amber-700" />
                        ) : (
                          <div className="leaderboard-rank bg-muted">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="leaderboard-user">
                        <div className="leaderboard-user-name">
                          {user.name}
                          {user.isCurrentUser && " (You)"}
                          {user.isCurrentUser && (
                            <User className="ml-1 h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="leaderboard-user-stats">
                          <p>{user.badge}</p>
                          <div className="leaderboard-user-level">
                            <Award className="h-4 w-4 text-primary" />
                            <span>Level {user.level}</span>
                            <span className="ml-1">
                              ({user.xp.toLocaleString()} XP)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
