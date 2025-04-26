"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, User as UserIcon, Leaf } from "lucide-react";
import { useContext } from "react";
import { Navbar } from "@/components/navbar";
import { UserContext, User } from "@/hooks/UserContext";

export default function LeaderboardPage() {
  const { user } = useContext(UserContext);

  const topUsersRegion: User[] = user?.topUsersRegion || [];
  const topUsersGlobal: User[] = user?.topUsersGlobal || [];

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
                {topUsersGlobal.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No records found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topUsersGlobal.map((u, index) => (
                      <div
                        key={u.id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          u.id === user?.id
                            ? "bg-primary/5 border-2 border-primary/20"
                            : "bg-muted/50"
                        }`}
                      >
                        {/* Rank */}
                        <div className="flex flex-col items-center w-8">
                          {index === 0 ? (
                            <Trophy className="h-6 w-6 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="h-6 w-6 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="h-6 w-6 text-amber-700" />
                          ) : (
                            <div className="text-sm font-semibold">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold flex items-center">
                            {u.name}
                            {u.id === user?.id && (
                              <>
                                {" "}
                                (You)
                                <UserIcon className="ml-1 h-4 w-4 text-primary" />
                              </>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {u.region}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary mt-1">
                            <Award className="h-4 w-4" />
                            <span>Level {u.level}</span>
                            <span>({u.exp.toLocaleString()} XP)</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local">
            <Card>
              <CardHeader>
                <CardTitle>Local Leaderboard</CardTitle>
                <CardDescription>
                  Top recyclers in {user?.region}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topUsersRegion.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No records found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topUsersRegion.map((u, index) => (
                      <div
                        key={u.id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          u.id === user?.id
                            ? "bg-primary/5 border-2 border-primary/20"
                            : "bg-muted/50"
                        }`}
                      >
                        {/* Rank */}
                        <div className="flex flex-col items-center w-8">
                          {index === 0 ? (
                            <Trophy className="h-6 w-6 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="h-6 w-6 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="h-6 w-6 text-amber-700" />
                          ) : (
                            <div className="text-sm font-semibold">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold flex items-center">
                            {u.name}
                            {u.id === user?.id && (
                              <>
                                {" "}
                                (You)
                                <UserIcon className="ml-1 h-4 w-4 text-primary" />
                              </>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {u.region}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary mt-1">
                            <Award className="h-4 w-4" />
                            <span>Level {u.level}</span>
                            <span>({u.exp.toLocaleString()} XP)</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
