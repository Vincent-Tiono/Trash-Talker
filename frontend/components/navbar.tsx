"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Recycle,
  Menu,
  User,
  Camera,
  Upload,
  Trophy,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "./theme-switch";
import { supabase } from "./supabase";

export function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const logoutHandler = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <Image
            src={theme == "dark" ? "/default_dark.png" : "/default.png"}
            alt="Logo"
            width={220}
            height={220}
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/scan-trash">
            <Button
              variant={isActive("/scan-trash") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              Scan Trash
            </Button>
          </Link>
          <Link href="/prove-disposal">
            <Button
              variant={isActive("/prove-disposal") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Prove Disposal
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button
              variant={isActive("/leaderboard") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeSwitch />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/scan-trash" className="cursor-pointer">
                  <Camera className="mr-2 h-4 w-4" />
                  <span>Scan Trash</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/prove-disposal" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Prove Disposal</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/leaderboard" className="cursor-pointer">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/login"
                  onClick={logoutHandler}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="md:hidden rounded-xl">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/scan-trash" className="cursor-pointer">
                  <Camera className="mr-2 h-4 w-4" />
                  <span>Scan Trash</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/prove-disposal" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Prove Disposal</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/leaderboard" className="cursor-pointer">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
